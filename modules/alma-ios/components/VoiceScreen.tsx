"use client";

import { useEffect, useRef, useState } from "react";
import type { PatientProfile, Preference } from "../types";
import { CaptureIcon, CloseIcon, MicLargeIcon } from "./Icons";

export type VoiceContext = "idle" | "panic";
type CapturePhase = "idle" | "recording" | "review" | "saved";
type AskPhase = "listening" | "connecting" | "thinking" | "phrase";

const SCRIPTED_TRANSCRIPT =
  "He really lights up when I bring his old wooden carpenter's pencil. He turns it in his hands and starts telling stories about the workshop. It calms him down within a minute, even on bad days.";
const ALMA_SUGGESTED_NAME = "Wooden carpenter's pencil for workshop stories";
const ALMA_SUGGESTED_TRIGGER =
  "When David is restless, anxious, or needs a familiar object to hold";

function formatDuration(seconds: number) {
  const mm = Math.floor(seconds / 60).toString();
  const ss = (seconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export function VoiceScreen({
  patient,
  context,
  autoStartCapture = false,
  onClose,
  onCapturedPreference,
}: {
  patient: PatientProfile;
  context: VoiceContext;
  autoStartCapture?: boolean;
  onClose: () => void;
  onCapturedPreference: (draft: Preference) => void;
}) {
  const isPanic = context === "panic";
  const [askPhase, setAskPhase] = useState<AskPhase>(
    isPanic ? "connecting" : "listening",
  );
  const [capPhase, setCapPhase] = useState<CapturePhase>(
    !isPanic && autoStartCapture ? "recording" : "idle",
  );
  const [capDur, setCapDur] = useState(0);
  const capTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPanic) return;
    const reset = setTimeout(() => {
      setAskPhase("connecting");
      setCapPhase("idle");
    }, 0);
    const t1 = setTimeout(() => setAskPhase("thinking"), 900);
    const t2 = setTimeout(() => setAskPhase("phrase"), 2200);
    return () => {
      clearTimeout(reset);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isPanic, context]);

  useEffect(() => {
    if (capPhase === "recording") {
      capTimer.current = setInterval(() => setCapDur((d) => d + 1), 1000);
    } else if (capTimer.current) {
      clearInterval(capTimer.current);
      capTimer.current = null;
    }
    return () => {
      if (capTimer.current) {
        clearInterval(capTimer.current);
        capTimer.current = null;
      }
    };
  }, [capPhase]);

  const inVoiceCapture = !isPanic && capPhase !== "idle";
  const orbActive =
    (isPanic && askPhase !== "phrase") ||
    (!isPanic && inVoiceCapture && capPhase === "recording") ||
    (!isPanic && !inVoiceCapture && askPhase === "listening");
  const orbWarm = isPanic && askPhase === "phrase";
  const canTapOrbToRecord =
    !isPanic && askPhase === "listening" && capPhase === "idle";

  function startRec() {
    setCapDur(0);
    setCapPhase("recording");
  }
  function stopRec() {
    setCapPhase("review");
  }
  function discardRec() {
    setCapPhase("idle");
    setCapDur(0);
  }
  function openEditFromCapture() {
    onCapturedPreference({
      name: ALMA_SUGGESTED_NAME,
      trigger: ALMA_SUGGESTED_TRIGGER,
      note: SCRIPTED_TRANSCRIPT,
      source: "You (just now)",
      date: new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    });
    discardRec();
  }

  const topTitle = isPanic
    ? `${patient.name.split(" ")[0]} · in distress`
    : capPhase === "recording"
      ? `Speaking · ${patient.name.split(" ")[0]}`
      : capPhase === "review"
        ? `Review · ${patient.name.split(" ")[0]}`
        : capPhase === "saved"
          ? "Saved"
          : `Alma · ${patient.name.split(" ")[0]}`;

  return (
    <div
      className="absolute inset-0 z-[150] flex flex-col text-[#F4ECD9]"
      style={{
        background: isPanic
          ? "radial-gradient(120% 80% at 50% 0%, #2A1F19 0%, #1A1411 100%)"
          : "radial-gradient(120% 80% at 50% 0%, #3B302A 0%, #211C18 100%)",
      }}
    >
      <div className="flex items-center justify-between gap-2 px-3.5 pb-2 pt-[70px]">
        <div className="w-10 shrink-0" />
        <div className="min-w-0 flex-1 text-center font-mono text-[11px] tracking-[0.4px] text-white/60">
          {topTitle}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F4ECD9]"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <div
        role={canTapOrbToRecord ? "button" : undefined}
        tabIndex={canTapOrbToRecord ? 0 : undefined}
        aria-label={canTapOrbToRecord ? "Start speaking" : undefined}
        onClick={canTapOrbToRecord ? startRec : undefined}
        onKeyDown={
          canTapOrbToRecord
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  startRec();
                }
              }
            : undefined
        }
        className="flex flex-col items-center justify-center px-5 pb-1 pt-2 outline-none transition-[padding] duration-300"
        style={{ cursor: canTapOrbToRecord ? "pointer" : "default" }}
      >
        <div
          className="relative flex items-center justify-center transition-[width,height] duration-300"
          style={{
            width: capPhase === "review" ? 96 : 168,
            height: capPhase === "review" ? 96 : 168,
          }}
        >
          {orbActive ? (
            <>
              <div
                className="alma-pulse-ring absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(232,162,118,0.5), transparent 70%)",
                }}
              />
              <div
                className="alma-pulse-ring-2 absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(232,162,118,0.35), transparent 70%)",
                }}
              />
            </>
          ) : null}
          <div
            className={`relative z-10 flex size-[64%] items-center justify-center rounded-full ${
              orbActive ? "alma-breathe" : ""
            }`}
            style={{
              background: orbWarm
                ? "radial-gradient(circle at 30% 30%, #F2D8C4, #B5552A 70%)"
                : "radial-gradient(circle at 30% 30%, #E8A276, #8C3E1F 70%)",
              boxShadow:
                "0 0 60px rgba(232,162,118,0.45), inset -20px -20px 40px rgba(0,0,0,0.18)",
            }}
          >
            <span className="text-white/90">
              <MicLargeIcon />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-[18px] pt-2">
        {isPanic ? (
          <div className="w-full text-center">
            {askPhase === "connecting" ? (
              <div className="alma-fade-up py-4 font-mono text-[13px] tracking-[0.5px] text-white/60">
                Connecting…
              </div>
            ) : null}
            {askPhase === "thinking" ? (
              <div className="alma-fade-up py-4 font-mono text-[13px] tracking-[0.5px] text-white/60">
                Looking up what calms {patient.name.split(" ")[0]}…
              </div>
            ) : null}
            {askPhase === "phrase" ? (
              <div className="alma-fade-up px-1 pt-1">
                <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[1.4px] text-white/50">
                  Say this — calmly
                </div>
                <p className="m-0 font-serif text-[22px] font-normal italic leading-[1.3] tracking-[-0.3px] text-[#FBEFE5]">
                  &quot;You&apos;ve slept well, {patient.name.split(" ")[0]}.
                  You&apos;re safe here.&quot;
                </p>
                <div className="mt-2.5 text-[11.5px] text-white/65">
                  Hand him a glass of cold water.
                </div>
                <div className="mt-3 font-mono text-[10.5px] tracking-[0.3px] text-white/40">
                  from Anne (daughter), 12 April
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {!isPanic && capPhase === "idle" ? (
          <div className="alma-fade-up text-center font-mono text-[12px] tracking-[0.5px] text-white/55">
            Tap the orb to capture a preference, or speak to ask Alma.
          </div>
        ) : null}

        {!isPanic && capPhase === "recording" ? (
          <div className="alma-fade-up flex flex-col items-center gap-3 pt-1 text-center">
            <div className="font-mono text-[11px] uppercase tracking-[1.4px] text-white/55">
              Recording · {formatDuration(capDur)}
            </div>
            <button
              type="button"
              onClick={stopRec}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12.5px] font-medium text-white/85"
            >
              <CaptureIcon /> Stop & review
            </button>
          </div>
        ) : null}

        {!isPanic && capPhase === "review" ? (
          <div className="alma-fade-up flex flex-col gap-3 pt-1">
            <p className="font-mono text-[10.5px] uppercase tracking-[1.4px] text-white/50">
              Transcript
            </p>
            <p className="font-serif text-[15.5px] italic leading-[1.45] text-[#FBEFE5]">
              &quot;{SCRIPTED_TRANSCRIPT}&quot;
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={discardRec}
                className="flex-1 rounded-[12px] border border-white/20 bg-white/5 px-3 py-2.5 text-[12.5px] font-medium text-white/80"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={openEditFromCapture}
                className="flex-1 rounded-[12px] bg-[#FBEFE5] px-3 py-2.5 text-[12.5px] font-semibold text-[#2B2622]"
              >
                Save as preference
              </button>
            </div>
          </div>
        ) : null}

        {!isPanic && capPhase === "saved" ? (
          <div className="alma-fade-up py-6 text-center font-mono text-[12px] uppercase tracking-[1.4px] text-white/65">
            Saved to Care Passport
          </div>
        ) : null}
      </div>
    </div>
  );
}
