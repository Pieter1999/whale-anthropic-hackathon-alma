"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PatientProfile } from "../types";

type VapiCallState = "idle" | "connecting" | "active" | "speaking" | "ended";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const carePassportBaseUrl = process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL;

function readableError(error: unknown): string {
  if (!error) {
    return "Unknown Vapi error.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const nested = record.error;

    if (typeof nested === "string") {
      return nested;
    }

    if (nested && typeof nested === "object") {
      const nestedRecord = nested as Record<string, unknown>;
      if (typeof nestedRecord.message === "string") {
        return nestedRecord.message;
      }
    }

    if (typeof record.message === "string") {
      return record.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "Vapi call failed.";
    }
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
  const [callState, setCallState] = useState<VapiCallState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      logVapiEvent("call-start");
      setCallState("active");
      setError(null);
    });
    vapi.on("speech-start", () => {
      logVapiEvent("speech-start");
      setCallState("speaking");
    });
    vapi.on("speech-end", () => {
      logVapiEvent("speech-end");
      setCallState("active");
    });
    vapi.on("call-end", () => {
      logVapiEvent("call-end");
      setCallState("ended");
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
    });

    return () => {
      vapi.removeAllListeners();
      void vapi.stop().catch(() => undefined);
      vapiRef.current = null;
    };
  }, [onCallEnded]);

  const startCall = useCallback(async () => {
    if (!publicKey || !assistantId) {
      setError(
        "Vapi is not configured. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID.",
      );
      return;
    }

    if (!vapiRef.current) {
      vapiRef.current = new Vapi(publicKey);
    }

    setCallState("connecting");
    setError(null);

    try {
      logVapiEvent("start requested", {
        assistantId,
        patientId: patient.id,
        carePassportBaseUrl,
      });

      const call = await vapiRef.current.start(assistantId, {
        variableValues: {
          patientId: patient.id,
          patientName: patient.name,
          carePassportBaseUrl,
        },
      });

      if (!call) {
        setCallState("idle");
        setError(
          "Vapi did not create a call. Check the browser console for the detailed Vapi error.",
        );
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
      isConnecting: callState === "connecting",
      isInCall: callState === "active" || callState === "speaking",
      isSpeaking: callState === "speaking",
      toggleCall,
      startCall,
      stopCall,
    }),
    [callState, error, startCall, stopCall, toggleCall],
  );
}
