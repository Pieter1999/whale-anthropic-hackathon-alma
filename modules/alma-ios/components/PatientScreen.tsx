import { useState } from "react";
import type {
  PatientProfile,
  Preference,
  PreferenceDraft,
} from "../types";
import { AlmaActionCard } from "./AlmaActionCard";
import { PatientHero } from "./PatientHero";
import {
  PreferenceEditSheet,
  type PreferenceEditTarget,
} from "./PreferenceEditSheet";
import { PreferenceSections } from "./PreferenceSections";

export function PatientScreen({
  patient,
  queryLoading,
  voiceConnecting,
  voiceInCall,
  voiceSpeaking,
  contributionLoading,
  contributionMessage,
  error,
  onAsk,
  onEditPreferenceSave,
}: {
  patient: PatientProfile;
  queryLoading?: boolean;
  voiceConnecting?: boolean;
  voiceInCall?: boolean;
  voiceSpeaking?: boolean;
  contributionLoading?: boolean;
  contributionMessage?: string | null;
  error?: string | null;
  onAsk?: () => void;
  onEditPreferenceSave?: (
    index: number | null,
    draft: PreferenceDraft,
  ) => void | Promise<void>;
}) {
  const [editTarget, setEditTarget] = useState<PreferenceEditTarget | null>(
    null,
  );

  function handleEditPreference(preference: Preference, index: number) {
    setEditTarget({ preference, index });
  }

  async function handleSavePreference(
    index: number | null,
    draft: PreferenceDraft,
  ) {
    await onEditPreferenceSave?.(index, draft);
    setEditTarget(null);
  }

  return (
    <main className="relative flex h-[calc(100%-58px)] flex-col overflow-hidden bg-[#F5F0E8]">
      <div className="min-h-0 flex-1 overflow-y-auto pb-[112px]">
        <PatientHero patient={patient} />
        {contributionMessage || error ? (
          <p className="mx-3.5 mb-2 rounded-xl border border-[#D6CFC0] bg-[#ECE7DA] px-3 py-2 text-[11.5px] text-[#1A3829]">
            {error ?? contributionMessage}
          </p>
        ) : null}
        <PreferenceSections
          preferences={patient.preferences}
          isSaving={contributionLoading}
          onEditPreference={handleEditPreference}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20">
        <div className="pointer-events-auto">
          <AlmaActionCard
            isLoading={queryLoading || voiceConnecting}
            isInCall={voiceInCall}
            isSpeaking={voiceSpeaking}
            onAsk={onAsk}
          />
        </div>
      </div>
      <PreferenceEditSheet
        target={editTarget}
        isSaving={contributionLoading}
        onClose={() => setEditTarget(null)}
        onSave={handleSavePreference}
      />
    </main>
  );
}
