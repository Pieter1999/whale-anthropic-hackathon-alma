import type { ReactNode } from "react";
import type { KnowledgeGap, Preference } from "../types";
import { PencilIcon } from "./Icons";

function SectionDivider({ children }: { children: ReactNode }) {
  return (
    <div className="px-0.5 pb-2 pt-6">
      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1 bg-[#E5DDD2]" />
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[1.4px] text-[#8A7F71]">
          {children}
        </span>
        <div className="h-px flex-1 bg-[#E5DDD2]" />
      </div>
    </div>
  );
}

function CaptureAnswerButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-[30px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#DCD2C2] bg-[#F2EEE7] px-3 py-1.5 text-xs font-medium text-[#4F4740]"
    >
      <PencilIcon />
      Capture answer
    </button>
  );
}

function GapCard({
  gap,
  disabled,
  onCaptureAnswer,
}: {
  gap: KnowledgeGap;
  disabled?: boolean;
  onCaptureAnswer?: (gap: KnowledgeGap) => void;
}) {
  return (
    <article className="rounded-xl border border-[#DCD2C2]/60 bg-white px-3 py-[11px]">
      <div className="flex items-start gap-2.5">
        <p className="min-w-0 flex-1 text-[13px] font-medium leading-[1.4] text-[#2B2622]">
          {gap.question}
        </p>
        <CaptureAnswerButton
          disabled={disabled}
          onClick={() => onCaptureAnswer?.(gap)}
        />
      </div>
    </article>
  );
}

function PreferenceCard({
  preference,
  disabled,
  onEditPreference,
}: {
  preference: Preference;
  disabled?: boolean;
  onEditPreference?: (preference: Preference) => void;
}) {
  return (
    <article className="relative rounded-xl border border-[#DCD2C2]/60 bg-white px-3 py-[11px] pr-10">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onEditPreference?.(preference)}
        aria-label={`Edit ${preference.title}`}
        className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-lg text-[#4F4740]"
      >
        <PencilIcon />
      </button>
      <h2 className="text-[13px] font-semibold leading-[1.35] text-[#2B2622]">
        {preference.title}
      </h2>
      <p className="mt-1 text-[11.8px] leading-[1.45] text-[#4F4740]">
        {preference.detail}
      </p>
      <p className="mt-3 text-[11px] text-[#8A7F71]">
        {preference.source} · {preference.date}
      </p>
    </article>
  );
}

export function PreferenceSections({
  unanswered,
  preferences,
  isSaving = false,
  onCaptureAnswer,
  onEditPreference,
}: {
  unanswered: KnowledgeGap[];
  preferences: Preference[];
  isSaving?: boolean;
  onCaptureAnswer?: (gap: KnowledgeGap) => void;
  onEditPreference?: (preference: Preference) => void;
}) {
  return (
    <section className="flex flex-col px-3.5 pb-6">
      <SectionDivider>Preferences · unanswered</SectionDivider>
      <div className="flex flex-col gap-2">
        {unanswered.map((gap) => (
          <GapCard
            key={gap.question}
            gap={gap}
            disabled={isSaving}
            onCaptureAnswer={onCaptureAnswer}
          />
        ))}
      </div>

      <SectionDivider>Preferences</SectionDivider>
      <div className="flex flex-col gap-2">
        {preferences.map((preference) => (
          <PreferenceCard
            key={preference.title}
            preference={preference}
            disabled={isSaving}
            onEditPreference={onEditPreference}
          />
        ))}
      </div>
    </section>
  );
}
