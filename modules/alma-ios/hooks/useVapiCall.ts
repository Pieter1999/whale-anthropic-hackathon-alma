"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PatientProfile } from "../types";

type VapiCallState = "idle" | "connecting" | "active" | "speaking" | "ended";

export type CallMessage = {
  role: "user" | "assistant";
  text: string;
};

export type LiveTranscript = {
  role: "user" | "assistant";
  text: string;
} | null;

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const carePassportBaseUrl = process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL;

function readableError(error: unknown): string {
  if (!error) return "Unknown Vapi error.";
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const nested = record.error;
    if (typeof nested === "string") return nested;
    if (nested && typeof nested === "object") {
      const nestedRecord = nested as Record<string, unknown>;
      if (typeof nestedRecord.message === "string") return nestedRecord.message;
    }
    if (typeof record.message === "string") return record.message;
    try { return JSON.stringify(error); } catch { return "Vapi call failed."; }
  }
  return String(error);
}

function logVapiEvent(label: string, payload?: unknown) {
  console.info(`[Vapi] ${label}`, payload ?? "");
}

export function useVapiCall({
  patient,
  onCallEnded,
}: {
  patient: PatientProfile;
  onCallEnded?: () => void | Promise<void>;
}) {
  const vapiRef = useRef<Vapi | null>(null);
  const callIdRef = useRef<string | null>(null);
  const [callState, setCallState] = useState<VapiCallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [callMessages, setCallMessages] = useState<CallMessage[]>([]);
  const [liveTranscript, setLiveTranscript] = useState<LiveTranscript>(null);

  useEffect(() => {
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      logVapiEvent("call-start");
      setCallState("active");
      setCallMessages([]);
      setLiveTranscript(null);
      setError(null);
    });

    async function fetchCallTranscript(callId: string) {
      if (!callId) return;
      try {
        await new Promise((r) => setTimeout(r, 2500));
        const res = await fetch(`/api/vapi/call/${callId}`);
        if (!res.ok) return;
        const data = await res.json() as Record<string, unknown>;
        const transcript = typeof data.transcript === "string" ? data.transcript : "";
        if (!transcript.trim()) return;
        const parsed: CallMessage[] = transcript
          .split("\n")
          .filter((line: string) => line.trim())
          .map((line: string) => {
            if (line.startsWith("AI:")) return { role: "assistant" as const, text: line.replace(/^AI:\s*/, "") };
            if (line.startsWith("User:")) return { role: "user" as const, text: line.replace(/^User:\s*/, "") };
            return null;
          })
          .filter((m): m is CallMessage => m !== null);
        if (parsed.length > 0) setCallMessages(parsed);
      } catch {
        // best-effort
      }
    }
    vapi.on("speech-start", () => {
      logVapiEvent("speech-start");
      setCallState("speaking");
    });
    vapi.on("speech-end", () => {
      logVapiEvent("speech-end");
      setCallState("active");
      setLiveTranscript(null);
    });
    vapi.on("call-end", () => {
      logVapiEvent("call-end");
      setCallState("ended");
      setLiveTranscript(null);
      if (callIdRef.current) void fetchCallTranscript(callIdRef.current);
      void onCallEnded?.();
    });
    vapi.on("call-start-progress", (event) => {
      logVapiEvent("call-start-progress", event);
    });
    vapi.on("call-start-failed", (event) => {
      console.error("[Vapi] call-start-failed", event);
      setCallState("idle");
      setError(event.error || "Vapi call failed to start.");
    });
    vapi.on("error", (err) => {
      console.error("[Vapi] error", err);
      setCallState("idle");
      setError(readableError(err));
    });
    vapi.on("message", (message) => {
      logVapiEvent("message", message);
      const msg = message as Record<string, unknown>;

      // transcript: partial = live display, final = commit to history
      if (msg.type === "transcript" && typeof msg.transcript === "string" && msg.transcript.trim()) {
        const role = msg.role === "user" ? "user" : "assistant";
        if (msg.transcriptType === "partial") {
          setLiveTranscript({ role, text: msg.transcript as string });
        } else if (msg.transcriptType === "final") {
          setLiveTranscript(null);
          setCallMessages((prev) => [...prev, { role, text: msg.transcript as string }]);
        }
      }

      // voice-input: reliable capture of what the user said
      if (msg.type === "voice-input" && typeof msg.input === "string" && msg.input.trim()) {
        setCallMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "user" && last.text === msg.input) return prev;
          return [...prev, { role: "user" as const, text: msg.input as string }];
        });
      }
    });

    return () => {
      vapi.removeAllListeners();
      void vapi.stop().catch(() => undefined);
      vapiRef.current = null;
    };
  }, [onCallEnded]);

  const startCall = useCallback(async () => {
    if (!publicKey || !assistantId) {
      setError("Vapi is not configured. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID.");
      return;
    }
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(publicKey);
    }
    setCallState("connecting");
    setError(null);
    try {
      logVapiEvent("start requested", { assistantId, patientId: patient.id, carePassportBaseUrl });
      const call = await vapiRef.current.start(assistantId, {
        variableValues: { patientId: patient.id, patientName: patient.name, carePassportBaseUrl },
      });
      if (call && typeof (call as Record<string, unknown>).id === "string") {
        callIdRef.current = (call as Record<string, unknown>).id as string;
        logVapiEvent("call id saved", callIdRef.current);
      }
      if (!call) {
        setCallState("idle");
        setError("Vapi did not create a call. Check the browser console for the detailed Vapi error.");
      }
    } catch (err) {
      console.error("[Vapi] start exception", err);
      setCallState("idle");
      setError(readableError(err));
    }
  }, [patient.id, patient.name]);

  const stopCall = useCallback(async () => {
    setError(null);
    try {
      await vapiRef.current?.stop();
      setCallState("ended");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not stop Vapi.");
    }
  }, []);

  const toggleCall = useCallback(async () => {
    if (callState === "connecting" || callState === "active" || callState === "speaking") {
      await stopCall();
      return;
    }
    await startCall();
  }, [callState, startCall, stopCall]);

  return useMemo(
    () => ({
      callState,
      error,
      callMessages,
      liveTranscript,
      isConnecting: callState === "connecting",
      isInCall: callState === "active" || callState === "speaking",
      isSpeaking: callState === "speaking",
      toggleCall,
      startCall,
      stopCall,
    }),
    [callState, error, callMessages, liveTranscript, startCall, stopCall, toggleCall],
  );
}
