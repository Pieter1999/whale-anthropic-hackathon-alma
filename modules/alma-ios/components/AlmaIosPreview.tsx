"use client";

import { useEffect, useState } from "react";
import type {
  KnowledgeGap,
  Preference,
  PreferenceDraft,
} from "../types";
import { davidProfile } from "../data/davidProfile";
import { usePatientProfile } from "../hooks/usePatientProfile";
import { useVapiCall } from "../hooks/useVapiCall";
import { PreviewColumn } from "./PreviewColumn";

function todayLabel() {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function AlmaIosPreview() {
  const {
    patient,
    loading,
    error,
    queryAnswer,
    queryLoading,
    contributionLoading,
    contributionMessage,
    refreshPatientProfile,
    postContribution,
  } = usePatientProfile();
  const activePatient = patient ?? davidProfile;

  const [localPreferences, setLocalPreferences] = useState<
    Preference[] | null
  >(null);

  useEffect(() => {
    setLocalPreferences(null);
  }, [activePatient.id, activePatient.preferences]);

  const effectivePatient = {
    ...activePatient,
    preferences: localPreferences ?? activePatient.preferences,
  };

  const {
    error: vapiError,
    isConnecting: voiceConnecting,
    isInCall: voiceInCall,
    isSpeaking: voiceSpeaking,
    toggleCall,
  } = useVapiCall({
    patient: effectivePatient,
    onCallEnded: refreshPatientProfile,
  });

  function askAlma() {
    void toggleCall();
  }

  function captureAnswer(gap: KnowledgeGap) {
    void postContribution({
      text: `Caregiver captured an answer for: ${gap.question}`,
      channel: "web",
      attribution: { kind: "staff", source: "alma-ios-preview" },
    });
  }

  async function savePreference(
    index: number | null,
    draft: PreferenceDraft,
  ) {
    setLocalPreferences((prev) => {
      const base = prev ?? effectivePatient.preferences;
      if (index == null) {
        const next: Preference = {
          name: draft.name,
          trigger: draft.trigger || undefined,
          note: draft.note,
          source: draft.source ?? "You",
          date: draft.date ?? todayLabel(),
        };
        return [...base, next];
      }
      const copy = [...base];
      const current = copy[index];
      if (!current) return base;
      copy[index] = {
        ...current,
        name: draft.name,
        trigger: draft.trigger || undefined,
        note: draft.note,
      };
      return copy;
    });

    try {
      await postContribution({
        text:
          index == null
            ? `New preference captured: ${draft.name}. ${draft.note}`
            : `Preference updated: ${draft.name}. ${draft.note}`,
        channel: "web",
        attribution: {
          kind: "staff",
          source: "alma-ios-preview",
          trigger: draft.trigger,
        },
      });
    } catch {
      // Local optimistic state stays; usePatientProfile already surfaces error.
    }
  }

  return (
    <main className="min-h-dvh w-full bg-[radial-gradient(1200px_700px_at_50%_-10%,#F1E7D6_0%,#E8DFD2_60%,#DDD2C0_100%)] px-4 py-8">
      {loading ? (
        <p className="mx-auto mb-4 w-fit rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-[#4F4740] shadow-sm">
          Loading Care Passport...
        </p>
      ) : null}
      <div className="mx-auto flex w-full max-w-[1200px] flex-row flex-wrap items-start justify-center gap-x-9 gap-y-7">
        <PreviewColumn
          title="Care team"
          patient={effectivePatient}
          queryAnswer={queryAnswer}
          queryLoading={queryLoading}
          voiceConnecting={voiceConnecting}
          voiceInCall={voiceInCall}
          voiceSpeaking={voiceSpeaking}
          contributionLoading={contributionLoading}
          contributionMessage={contributionMessage}
          error={vapiError ?? error}
          onAsk={askAlma}
          onCaptureAnswer={captureAnswer}
          onEditPreferenceSave={savePreference}
        />
        <PreviewColumn
          title="Family"
          patient={effectivePatient}
          queryAnswer={queryAnswer}
          queryLoading={queryLoading}
          voiceConnecting={voiceConnecting}
          voiceInCall={voiceInCall}
          voiceSpeaking={voiceSpeaking}
          contributionLoading={contributionLoading}
          contributionMessage={contributionMessage}
          error={vapiError ?? error}
          onAsk={askAlma}
          onCaptureAnswer={captureAnswer}
          onEditPreferenceSave={savePreference}
        />
      </div>
    </main>
  );
}
