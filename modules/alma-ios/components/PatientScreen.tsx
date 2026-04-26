import { useEffect, useRef } from "react";
import type {
  PatientProfile,
  Preference,
  QueryAnswer,
} from "../types";
import type { CallMessage, LiveTranscript } from "../hooks/useVapiCall";
import { AlmaActionCard } from "./AlmaActionCard";
import { SettingsIcon } from "./Icons";
import { PatientHero } from "./PatientHero";
import { PreferenceSections } from "./PreferenceSections";

function AlmaResponseSection({
  answer,
  callMessages,
  liveTranscript,
  isInCall,
  isSpeaking,
  isLoading,
}: {
  answer?: QueryAnswer | null;
  callMessages?: CallMessage[];
  liveTranscript?: LiveTranscript | null;
  isInCall?: boolean;
  isSpeaking?: boolean;
  isLoading?: boolean;
}) {
  const isActive = isInCall || isSpeaking || isLoading;
  const hasMessages = callMessages && callMessages.length > 0;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasMessages || liveTranscript) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [hasMessages, liveTranscript]);

  return (
    <section ref={sectionRef} className="mx-3.5 mb-2 overflow-hidden rounded-[16px] bg-[#1A3829] shadow-[0_4px_16px_rgba(20,46,32,0.22)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
        <div className="flex size-5 items-center justify-center rounded-full bg-[#C8923A]">
          <span className="text-[9px] font-bold text-white">A</span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#F5EDD8]/70">
          Alma
        </span>
        {isActive && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#C8923A]">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-[#C8923A]" />
            {isSpeaking ? "Speaking…" : "Listening…"}
          </span>
        )}
      </div>

      <div className="flex max-h-[220px] flex-col overflow-y-auto px-3.5 py-3">
        {hasMessages ? (
          <div className="flex flex-col gap-2">
            {callMessages.map((msg, i) =>
              msg.role === "assistant" ? (
                <p key={i} className="text-[13px] font-medium leading-[1.55] text-[#F5EDD8]">
                  {msg.text}
                </p>
              ) : (
                <p key={i} className="text-[11px] leading-[1.4] text-[#F5EDD8]/45 before:mr-1 before:content-['›']">
                  {msg.text}
                </p>
              )
            )}
            {liveTranscript && (
              <p className={`text-[12px] leading-[1.45] italic ${liveTranscript.role === "assistant" ? "text-[#F5EDD8]/70" : "text-[#F5EDD8]/35 before:mr-1 before:content-['›']"}`}>
                {liveTranscript.text}
              </p>
            )}
          </div>
        ) : liveTranscript ? (
          <p className={`text-[12px] leading-[1.45] italic ${liveTranscript.role === "assistant" ? "text-[#F5EDD8]/70" : "text-[#F5EDD8]/35"}`}>
            {liveTranscript.text}
          </p>
        ) : answer ? (
          <>
            <p className="text-[13px] font-medium leading-[1.55] text-[#F5EDD8]">
              {answer.answer}
            </p>
            {answer.evidence.length > 0 && (
              <p className="mb-2 text-[10.5px] text-[#F5EDD8]/45">
                {answer.evidence[0]}
              </p>
            )}
          </>
        ) : (
          <p className="font-caveat text-[15px] leading-[1.4] text-[#F5EDD8]/50">
            {isActive
              ? "Processing your question…"
              : "Tap the button above to ask Alma about this patient."}
          </p>
        )}
      </div>
    </section>
  );
}

export function PatientScreen({
  patient,
  queryAnswer,
  queryLoading,
  callMessages,
  liveTranscript,
  voiceConnecting,
  voiceInCall,
  voiceSpeaking,
  contributionLoading,
  contributionMessage,
  error,
  onAsk,
  onEditPreference,
}: {
  patient: PatientProfile;
  queryAnswer?: QueryAnswer | null;
  queryLoading?: boolean;
  callMessages?: CallMessage[];
  liveTranscript?: LiveTranscript | null;
  voiceConnecting?: boolean;
  voiceInCall?: boolean;
  voiceSpeaking?: boolean;
  contributionLoading?: boolean;
  contributionMessage?: string | null;
  error?: string | null;
  onAsk?: () => void;
  onEditPreference?: (preference: Preference) => void;
}) {
  return (
    <main className="flex h-[calc(100%-58px)] flex-col overflow-y-auto bg-[#F5F0E8] pb-7">
      <div className="flex shrink-0 items-center justify-between px-3.5 pb-1 pt-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A3829]">
            <span className="text-[10px] font-semibold text-[#F5EDD8]">A</span>
          </div>
          <span className="text-[13px] font-semibold tracking-[-0.2px] text-[#1A3829]">Alma</span>
        </div>
        <button
          type="button"
          aria-label="Settings"
          className="flex size-8 items-center justify-center rounded-full bg-[#1A3829]/8 text-[#1A3829]/60 transition-colors hover:bg-[#1A3829]/15"
        >
          <SettingsIcon />
        </button>
      </div>
      <AlmaActionCard
        isLoading={queryLoading || voiceConnecting}
        isInCall={voiceInCall}
        isSpeaking={voiceSpeaking}
        onAsk={onAsk}
      />
      <AlmaResponseSection
        answer={queryAnswer}
        callMessages={callMessages}
        liveTranscript={liveTranscript}
        isInCall={voiceInCall}
        isSpeaking={voiceSpeaking}
        isLoading={queryLoading || voiceConnecting}
      />
      <PatientHero patient={patient} />
      {contributionMessage || error ? (
        <p className="mx-3.5 mb-2 rounded-xl border border-[#D6CFC0] bg-[#ECE7DA] px-3 py-2 text-[11.5px] text-[#1A3829]">
          {error ?? contributionMessage}
        </p>
      ) : null}
      <PreferenceSections
        preferences={patient.preferences}
        isSaving={contributionLoading}
        onEditPreference={onEditPreference}
      />
    </main>
  );
}
