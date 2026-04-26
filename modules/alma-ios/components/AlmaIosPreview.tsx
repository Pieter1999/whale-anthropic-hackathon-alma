"use client";

import { useState } from "react";
import type { PatientProfile, Preference, PreferenceDraft } from "../types";
import { usePatientProfile } from "../hooks/usePatientProfile";
import { useVapiCall } from "../hooks/useVapiCall";
import { PreviewColumn } from "./PreviewColumn";

const DEMO_PATIENTS = [
  { id: "anna", label: "Anna van der Berg" },
  { id: "pieter", label: "Pieter de Lange" },
  { id: "maria", label: "Maria Jansen" },
];

type LocalPreferenceState = {
  patientId: string;
  basePreferences: Preference[];
  preferences: Preference[];
};

function todayLabel() {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function emptyPatientProfile(patientId: string): PatientProfile {
  const patientLabel =
    DEMO_PATIENTS.find((patient) => patient.id === patientId)?.label ??
    patientId.replaceAll("-", " ");

  return {
    id: patientId,
    name: patientLabel,
    initials: patientLabel
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    age: 0,
    room: "Care Passport",
    oneLine: "Loading the Care Passport from the database.",
    unanswered: [],
    preferences: [],
  };
}

export function AlmaIosPreview() {
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const [localPreferences, setLocalPreferences] =
    useState<LocalPreferenceState | null>(null);
  const {
    patient,
    loading,
    error,
    queryLoading,
    contributionLoading,
    contributionMessage,
    refreshPatientProfile,
    postContribution,
  } = usePatientProfile(selectedPatientId);
  const basePatient = patient ?? emptyPatientProfile(selectedPatientId);
  const preferences =
    localPreferences?.patientId === basePatient.id &&
    localPreferences.basePreferences === basePatient.preferences
      ? localPreferences.preferences
      : basePatient.preferences;
  const activePatient = {
    ...basePatient,
    preferences,
  };
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

  async function savePreference(index: number | null, draft: PreferenceDraft) {
    setLocalPreferences((prev) => {
      const base =
        prev?.patientId === basePatient.id &&
        prev.basePreferences === basePatient.preferences
          ? prev.preferences
          : basePatient.preferences;

      if (index == null) {
        return {
          patientId: basePatient.id,
          basePreferences: basePatient.preferences,
          preferences: [
            ...base,
            {
              name: draft.name,
              trigger: draft.trigger || undefined,
              note: draft.note,
              source: draft.source ?? "You",
              date: draft.date ?? todayLabel(),
            },
          ],
        };
      }

      const copy = [...base];
      const current = copy[index];
      if (!current) return prev;

      copy[index] = {
        ...current,
        name: draft.name,
        trigger: draft.trigger || undefined,
        note: draft.note,
      };

      return {
        patientId: basePatient.id,
        basePreferences: basePatient.preferences,
        preferences: copy,
      };
    });

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
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#1A3829]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#2a5240] opacity-40 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-[#C8923A] opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#142e20] opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col px-6 py-8">
        {/* Header */}
        <header className="mx-auto mb-10 flex w-full max-w-[1200px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8923A] shadow-lg">
              <span className="text-[14px] font-bold text-white">A</span>
            </div>
            <div>
              <span className="block text-[17px] font-semibold tracking-[-0.4px] text-white">
                Alma
              </span>
              <span className="font-caveat text-[12px] text-[#C8923A]">
                The soul of care, finally remembered.
              </span>
            </div>
          </div>

          {/* Patient selector */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
            <span className="pl-2 text-[11px] font-medium uppercase tracking-[1px] text-white/40">
              Patient
            </span>
            <div className="relative">
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="appearance-none cursor-pointer rounded-xl bg-white/10 py-1.5 pl-3 pr-7 text-[13px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {DEMO_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#1A3829] text-white">
                    {p.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50">
                <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                  <path d="M1 1l3.5 3L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          {/* Status pill */}
          {loading ? (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#C8923A]" />
              <span className="text-[12px] text-white/60">Loading passport…</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[12px] text-white/60">Passport loaded</span>
            </div>
          )}
        </header>

        {/* Phone */}
        <div className="mx-auto flex w-full max-w-[1200px] flex-1 items-start justify-center">
          <PreviewColumn
            title="Care team view"
            subtitle="Alma · Patient profile · Real-time guidance"
            patient={activePatient}
            queryLoading={queryLoading}
            voiceConnecting={voiceConnecting}
            voiceInCall={voiceInCall}
            voiceSpeaking={voiceSpeaking}
            contributionLoading={contributionLoading}
            contributionMessage={contributionMessage}
            error={vapiError ?? error}
            onAsk={askAlma}
            onEditPreferenceSave={savePreference}
          />
        </div>
      </div>
    </main>
  );
}
