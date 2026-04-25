import type { ReactNode } from "react";
import type { KnowledgeGap, Preference } from "../types";
import { MicIcon, PencilIcon } from "./Icons";

function SectionDivider({ children }: { children: ReactNode }) {
  return (
    <div className="px-0.5 pb-3 pt-7">
      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1 bg-[#E5DDD2]" />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[1.5px] text-[#8A7F71]">
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
      className="inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-full border border-[#DCD2C2] bg-[#F2EEE7] px-2 text-[10px] font-medium text-[#8A7F71] transition hover:bg-[#EBE4D8] active:bg-[#EBE4D8]"
    >
      <span className="scale-[0.55] -mx-1.5">
        <MicIcon />
      </span>
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
      <div className="flex items-center gap-2.5">
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
  index,
  disabled,
  onEditPreference,
}: {
  preference: Preference;
  index: number;
  disabled?: boolean;
  onEditPreference?: (preference: Preference, index: number) => void;
}) {
  const open = () => onEditPreference?.(preference, index);
  return (
    <article
      role={onEditPreference ? "button" : undefined}
      tabIndex={onEditPreference ? 0 : undefined}
      onClick={onEditPreference ? open : undefined}
      onKeyDown={
        onEditPreference
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open();
              }
            }
          : undefined
      }
      className="group relative cursor-pointer rounded-xl border border-[#DCD2C2]/60 bg-white px-3 py-[11px] pr-10 outline-none transition hover:border-[#DCD2C2] hover:shadow-sm active:bg-[#FAF6EE]"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
        aria-label={`Edit ${preference.name}`}
        className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-lg text-[#8A7F71] opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 hover:bg-[#F2EEE7] hover:text-[#4F4740]"
      >
        <PencilIcon />
      </button>
      <h2 className="text-[13px] font-semibold leading-[1.35] text-[#2B2622]">
        {preference.name}
      </h2>
      <p className="mt-1 text-[11.8px] leading-[1.45] text-[#4F4740]">
        {preference.note}
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
  onEditPreference?: (preference: Preference, index: number) => void;
}) {
  return (
    <section className="flex flex-col px-5 pb-6">
      {unanswered.length > 0 ? (
        <>
          <SectionDivider>Preferences · unanswered</SectionDivider>
          <div className="flex flex-col gap-3">
            {unanswered.map((gap) => (
              <GapCard
                key={gap.question}
                gap={gap}
                disabled={isSaving}
                onCaptureAnswer={onCaptureAnswer}
              />
            ))}
          </div>
        </>
      ) : null}

      <SectionDivider>Preferences</SectionDivider>
      <div className="flex flex-col gap-3">
        {preferences.map((preference, index) => (
          <PreferenceCard
            key={`${preference.name}-${index}`}
            preference={preference}
            index={index}
            disabled={isSaving}
            onEditPreference={onEditPreference}
          />
        ))}
      </div>
    </section>
  );
}
