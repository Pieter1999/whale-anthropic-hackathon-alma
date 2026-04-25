"use client";

import { useState } from "react";
import type {
  KnowledgeGap,
  PatientProfile,
  Preference,
  PreferenceDraft,
  QueryAnswer,
} from "../types";
import { AlmaActionCard } from "./AlmaActionCard";
import { AlertIcon, MicIcon, SettingsIcon } from "./Icons";
import { PatientHero } from "./PatientHero";
import {
  PreferenceEditSheet,
  type PreferenceEditTarget,
} from "./PreferenceEditSheet";
import { PreferenceSections } from "./PreferenceSections";
import { VoiceScreen, type VoiceContext } from "./VoiceScreen";

function QueryAnswerCard({ answer }: { answer: QueryAnswer }) {
  return (
    <section className="mx-5 mb-2 rounded-[14px] border border-[#DCD2C2]/70 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(43,38,34,0.05)]">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[1.3px] text-[#8A7F71]">
        Alma answer
      </p>
      <p className="mt-1.5 text-[13px] font-medium leading-[1.45] text-[#2B2622]">
        {answer.answer}
      </p>
      <p className="mt-2 text-[11px] text-[#8A7F71]">
        {Math.round(answer.confidence * 100)}% confidence
        {answer.evidence.length > 0 ? ` · ${answer.evidence[0]}` : ""}
      </p>
    </section>
  );
}

function DistressCard({
  patient,
  onTalkToAlma,
  onMarkSettled,
}: {
  patient: PatientProfile;
  onTalkToAlma: () => void;
  onMarkSettled: () => void;
}) {
  const firstName = patient.name.split(" ")[0];
  return (
    <section className="alma-fade-up mx-5 mb-2">
      <div
        className="flex items-start gap-2.5 rounded-[14px] border border-[#E8B7AC] px-3.5 py-3"
        style={{ background: "linear-gradient(180deg, #F6DBD6, #F8E5DF)" }}
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#B33A2E] text-[#FFE4DD]">
          <AlertIcon />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-[#7A1F18]">
            {firstName} is in distress now
          </p>
          <p className="mt-0.5 text-[11.5px] text-[#7A1F18]/85">
            Reported by Mehmet, 2 minutes ago · West hallway
          </p>
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={onTalkToAlma}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#B33A2E] px-3 py-1.5 text-[12px] font-semibold text-white"
            >
              <MicIcon />
              Talk to Alma
            </button>
            <button
              type="button"
              onClick={onMarkSettled}
              className="rounded-full border border-[#E8B7AC] bg-white px-3 py-1.5 text-[12px] font-medium text-[#7A1F18]"
            >
              Mark settled
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingsSheet({
  open,
  distress,
  onToggleDistress,
  onClose,
}: {
  open: boolean;
  distress: boolean;
  onToggleDistress: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-[100] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-sheet-title"
    >
      <button
        type="button"
        className="min-h-0 flex-1 cursor-default bg-[#2B2622]/35"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="max-h-[78%] overflow-y-auto rounded-t-[20px] border border-[#DCD2C2] border-b-0 bg-[#FFFCF7] px-5 pb-8 pt-5 shadow-[0_-8px_32px_rgba(43,38,34,0.12)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#DCD2C2]" />
        <h2
          id="settings-sheet-title"
          className="font-serif text-[19px] italic text-[#2B2622]"
        >
          Settings
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#4F4740]">
          Care Passport demo: manage notifications, data sharing, and Alma
          preferences here in a full build.
        </p>
        <button
          type="button"
          onClick={onToggleDistress}
          className="mt-5 w-full rounded-[12px] border border-[#DCD2C2] bg-white px-3 py-2.5 text-left text-[13px] font-medium text-[#2B2622]"
        >
          Demo · {distress ? "Mark settled" : "Trigger distress"}
        </button>
        <button
          type="button"
          className="mt-3 w-full rounded-[14px] bg-[#2B2622] py-3 text-[13.5px] font-semibold text-[#FBEFE5]"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export function PatientScreen({
  patient,
  queryAnswer,
  queryLoading,
  voiceConnecting,
  voiceInCall,
  voiceSpeaking,
  contributionLoading,
  contributionMessage,
  error,
  onAsk,
  onCaptureAnswer,
  onEditPreferenceSave,
}: {
  patient: PatientProfile;
  queryAnswer?: QueryAnswer | null;
  queryLoading?: boolean;
  voiceConnecting?: boolean;
  voiceInCall?: boolean;
  voiceSpeaking?: boolean;
  contributionLoading?: boolean;
  contributionMessage?: string | null;
  error?: string | null;
  onAsk?: () => void;
  onCaptureAnswer?: (gap: KnowledgeGap) => void;
  onEditPreferenceSave: (
    index: number | null,
    draft: PreferenceDraft,
  ) => void | Promise<void>;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [distress, setDistress] = useState(false);
  const [view, setView] = useState<"briefing" | "voice">("briefing");
  const [voiceContext, setVoiceContext] = useState<VoiceContext>("idle");
  const [voiceAutoStart, setVoiceAutoStart] = useState(false);
  const [editTarget, setEditTarget] = useState<PreferenceEditTarget | null>(
    null,
  );

  function openVoice(ctx: VoiceContext, autoStart = false) {
    setVoiceContext(ctx);
    setVoiceAutoStart(autoStart);
    setView("voice");
  }

  function handleAsk() {
    if (distress) {
      openVoice("panic");
      return;
    }
    onAsk?.();
  }

  function handleCaptureGap(gap: KnowledgeGap) {
    onCaptureAnswer?.(gap);
    openVoice("idle", true);
  }

  function handleEditPreference(preference: Preference, index: number) {
    setEditTarget({ preference, index });
  }

  function handleCapturedFromVoice(draft: Preference) {
    setEditTarget({ preference: draft, index: null, isNew: true });
    setView("briefing");
  }

  async function handleSavePreference(
    index: number | null,
    draft: PreferenceDraft,
  ) {
    await onEditPreferenceSave(index, draft);
    setEditTarget(null);
  }

  return (
    <main className="relative flex h-[calc(100%-58px)] flex-col overflow-hidden bg-[#F7F5F1]">
      <div className="min-h-0 flex-1 overflow-y-auto pb-7">
        <PatientHero
          patient={patient}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {distress ? (
          <DistressCard
            patient={patient}
            onTalkToAlma={() => openVoice("panic")}
            onMarkSettled={() => setDistress(false)}
          />
        ) : (
          <AlmaActionCard
            isLoading={queryLoading || voiceConnecting}
            isInCall={voiceInCall}
            isSpeaking={voiceSpeaking}
            onAsk={handleAsk}
          />
        )}

        {queryAnswer ? <QueryAnswerCard answer={queryAnswer} /> : null}
        {contributionMessage || error ? (
          <p className="mx-5 mb-2 rounded-xl bg-[#F2EEE7] px-3 py-2 text-[11.5px] text-[#4F4740]">
            {error ?? contributionMessage}
          </p>
        ) : null}

        <PreferenceSections
          unanswered={patient.unanswered}
          preferences={patient.preferences}
          isSaving={contributionLoading}
          onCaptureAnswer={handleCaptureGap}
          onEditPreference={handleEditPreference}
        />
      </div>

      {view === "voice" ? (
        <VoiceScreen
          patient={patient}
          context={voiceContext}
          autoStartCapture={voiceAutoStart}
          onClose={() => setView("briefing")}
          onCapturedPreference={handleCapturedFromVoice}
        />
      ) : null}

      <PreferenceEditSheet
        target={editTarget}
        isSaving={contributionLoading}
        onClose={() => setEditTarget(null)}
        onSave={handleSavePreference}
      />

      <SettingsSheet
        open={settingsOpen}
        distress={distress}
        onToggleDistress={() => setDistress((d) => !d)}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}
