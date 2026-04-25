import type {
  KnowledgeGap,
  PatientProfile,
  Preference,
  QueryAnswer,
} from "../types";
import { AlmaActionCard } from "./AlmaActionCard";
import { SettingsIcon } from "./Icons";
import { PatientHero } from "./PatientHero";
import { PreferenceSections } from "./PreferenceSections";

function QueryAnswerCard({ answer }: { answer: QueryAnswer }) {
  return (
    <section className="mx-3.5 mb-2 rounded-[14px] border border-[#DCD2C2]/70 bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(43,38,34,0.05)]">
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
  onEditPreference,
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
  onEditPreference?: (preference: Preference) => void;
}) {
  return (
    <main className="flex h-[calc(100%-58px)] flex-col overflow-y-auto bg-[#F7F5F1] pb-7">
      <div className="flex shrink-0 justify-end px-3.5 pb-0.5 pt-1">
        <button
          type="button"
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-xl border border-[#DCD2C2] bg-[#F2EEE7] text-[#4F4740]"
        >
          <SettingsIcon />
        </button>
      </div>
      <PatientHero patient={patient} />
      <AlmaActionCard
        isLoading={queryLoading || voiceConnecting}
        isInCall={voiceInCall}
        isSpeaking={voiceSpeaking}
        onAsk={onAsk}
      />
      {queryAnswer ? <QueryAnswerCard answer={queryAnswer} /> : null}
      {contributionMessage || error ? (
        <p className="mx-3.5 mb-2 rounded-xl bg-[#F2EEE7] px-3 py-2 text-[11.5px] text-[#4F4740]">
          {error ?? contributionMessage}
        </p>
      ) : null}
      <PreferenceSections
        unanswered={patient.unanswered}
        preferences={patient.preferences}
        isSaving={contributionLoading}
        onCaptureAnswer={onCaptureAnswer}
        onEditPreference={onEditPreference}
      />
    </main>
  );
}
