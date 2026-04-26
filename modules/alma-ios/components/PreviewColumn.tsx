import { IphoneFrame } from "./IphoneFrame";
import { PatientScreen } from "./PatientScreen";
import type {
  PatientProfile,
  PreferenceDraft,
} from "../types";

export function PreviewColumn({
  title,
  subtitle,
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
  title: string;
  subtitle: string;
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
  return (
    <section className="flex flex-col items-center gap-4">
      <header className="text-center">
        <h2 className="font-caveat text-[24px] font-medium text-white">
          {title}
        </h2>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[1.6px] text-white/40">
          {subtitle}
        </p>
      </header>
      <IphoneFrame>
        <PatientScreen
          patient={patient}
          queryLoading={queryLoading}
          voiceConnecting={voiceConnecting}
          voiceInCall={voiceInCall}
          voiceSpeaking={voiceSpeaking}
          contributionLoading={contributionLoading}
          contributionMessage={contributionMessage}
          error={error}
          onAsk={onAsk}
          onEditPreferenceSave={onEditPreferenceSave}
        />
      </IphoneFrame>
    </section>
  );
}
