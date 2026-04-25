"use client";

import type { KnowledgeGap, Preference } from "../types";
import { davidProfile } from "../data/davidProfile";
import { usePatientProfile } from "../hooks/usePatientProfile";
import { useVapiCall } from "../hooks/useVapiCall";
import { PreviewColumn } from "./PreviewColumn";

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
  const {
    error: vapiError,
    isConnecting: voiceConnecting,
    isInCall: voiceInCall,
    isSpeaking: voiceSpeaking,
    toggleCall,
  } = useVapiCall({
    patient: activePatient,
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

  function editPreference(preference: Preference) {
    void postContribution({
      text: `Caregiver reviewed preference: ${preference.title}. ${preference.detail}`,
      channel: "web",
      attribution: { kind: "staff", source: "alma-ios-preview" },
    });
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
          subtitle="About (incl. Alma) & Settings"
          patient={activePatient}
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
          onEditPreference={editPreference}
        />
        <PreviewColumn
          title="Family"
          subtitle="David (incl. Alma) & Settings"
          patient={activePatient}
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
          onEditPreference={editPreference}
        />
      </div>
    </main>
  );
}
