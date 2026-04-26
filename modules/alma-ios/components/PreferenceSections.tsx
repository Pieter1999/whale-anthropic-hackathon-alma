import type { ReactNode } from "react";
import type { Preference } from "../types";
import { PencilIcon } from "./Icons";

function SectionDivider({ children }: { children: ReactNode }) {
  return (
    <div className="px-0.5 pb-2 pt-6">
      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1 bg-[#D6CFC0]" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[1.4px] text-[#6B7B72]">
          {children}
        </span>
        <div className="h-px flex-1 bg-[#D6CFC0]" />
      </div>
    </div>
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
      className="group relative cursor-pointer rounded-[12px] border border-[#D6CFC0]/60 bg-white px-3 py-[11px] pr-10 outline-none transition hover:border-[#C8923A]/55 hover:shadow-sm active:bg-[#F8F3EA]"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
        aria-label={`Edit ${preference.name}`}
        className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-lg text-[#6B7B72] transition-colors hover:bg-[#1A3829]/8 hover:text-[#1A3829] disabled:opacity-50"
      >
        <PencilIcon />
      </button>
      <h2 className="text-[13px] font-semibold leading-[1.35] text-[#1A3829]">
        {preference.name}
      </h2>
      <p className="mt-1 text-[11.8px] leading-[1.45] text-[#3D4D44]">
        {preference.note}
      </p>
      <p className="mt-3 text-[11px] text-[#6B7B72]">
        {preference.source} · {preference.date}
      </p>
    </article>
  );
}

export function PreferenceSections({
  preferences,
  isSaving = false,
  onEditPreference,
}: {
  preferences: Preference[];
  isSaving?: boolean;
  onEditPreference?: (preference: Preference, index: number) => void;
}) {
  return (
    <section className="flex flex-col px-3.5 pb-6">
      <SectionDivider>Preferences</SectionDivider>
      <div className="flex flex-col gap-2">
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
