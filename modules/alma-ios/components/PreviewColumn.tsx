import { IphoneFrame } from "./IphoneFrame";
import { PatientScreen } from "./PatientScreen";
import type {
  KnowledgeGap,
  PatientProfile,
  PreferenceDraft,
  QueryAnswer,
} from "../types";

export function PreviewColumn({
  title,
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
  title: string;
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
  return (
    <section className="flex flex-col items-center gap-3">
      <header className="text-center">
        <h2 className="font-serif text-xl italic tracking-[-0.5px] text-[#2B2622]">
          {title}
        </h2>
      </header>
      <IphoneFrame>
        <PatientScreen
          patient={patient}
          queryAnswer={queryAnswer}
          queryLoading={queryLoading}
          voiceConnecting={voiceConnecting}
          voiceInCall={voiceInCall}
          voiceSpeaking={voiceSpeaking}
          contributionLoading={contributionLoading}
          contributionMessage={contributionMessage}
          error={error}
          onAsk={onAsk}
          onCaptureAnswer={onCaptureAnswer}
          onEditPreferenceSave={onEditPreferenceSave}
        />
      </IphoneFrame>
    </section>
  );
}
