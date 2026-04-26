import { IphoneFrame } from "./IphoneFrame";
import { PatientScreen } from "./PatientScreen";
import type {
  PatientProfile,
  Preference,
  QueryAnswer,
} from "../types";
import type { CallMessage, LiveTranscript } from "../hooks/useVapiCall";

export function PreviewColumn({
  title,
  subtitle,
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
  title: string;
  subtitle: string;
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
          queryAnswer={queryAnswer}
          queryLoading={queryLoading}
          callMessages={callMessages}
          liveTranscript={liveTranscript}
          voiceConnecting={voiceConnecting}
          voiceInCall={voiceInCall}
          voiceSpeaking={voiceSpeaking}
          contributionLoading={contributionLoading}
          contributionMessage={contributionMessage}
          error={error}
          onAsk={onAsk}
          onEditPreference={onEditPreference}
        />
      </IphoneFrame>
    </section>
  );
}
