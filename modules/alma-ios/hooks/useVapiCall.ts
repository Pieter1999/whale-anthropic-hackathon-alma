"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PatientProfile } from "../types";

type VapiCallState = "idle" | "connecting" | "active" | "speaking" | "ended";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const carePassportBaseUrl = process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL;

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
      setCallState("active");
      setError(null);
    });
    vapi.on("speech-start", () => setCallState("speaking"));
    vapi.on("speech-end", () => setCallState("active"));
    vapi.on("call-end", () => {
      setCallState("ended");
      void onCallEnded?.();
    });
    vapi.on("call-start-failed", (event) => {
      setCallState("idle");
      setError(event.error || "Vapi call failed to start.");
    });
    vapi.on("error", (err) => {
      setCallState("idle");
      setError(err instanceof Error ? err.message : "Vapi call failed.");
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
      await vapiRef.current.start(assistantId, {
        variableValues: {
          patientId: patient.id,
          patientName: patient.name,
          carePassportBaseUrl,
        },
      });
    } catch (err) {
      setCallState("idle");
      setError(err instanceof Error ? err.message : "Could not start Vapi.");
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
