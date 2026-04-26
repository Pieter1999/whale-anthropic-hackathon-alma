import type { Preference } from "../types";
import { PencilIcon } from "./Icons";

function SectionDivider({ children }: { children: React.ReactNode }) {
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
  disabled,
  onEditPreference,
}: {
  preference: Preference;
  disabled?: boolean;
  onEditPreference?: (preference: Preference) => void;
}) {
  return (
    <article className="relative rounded-[12px] border border-[#D6CFC0]/60 bg-white px-3 py-[11px] pr-10">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onEditPreference?.(preference)}
        aria-label={`Edit ${preference.title}`}
        className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-lg text-[#6B7B72]"
      >
        <PencilIcon />
      </button>
      <h2 className="text-[13px] font-semibold leading-[1.35] text-[#1A3829]">
        {preference.title}
      </h2>
      <p className="mt-1 text-[11.8px] leading-[1.45] text-[#3D4D44]">
        {preference.detail}
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
  onEditPreference?: (preference: Preference) => void;
}) {
  return (
    <section className="flex flex-col px-3.5 pb-6">
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
