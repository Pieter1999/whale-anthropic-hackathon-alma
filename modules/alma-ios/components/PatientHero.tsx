import type { PatientProfile } from "../types";
import { SettingsIcon } from "./Icons";

export function PatientHero({
  patient,
  onOpenSettings,
}: {
  patient: PatientProfile;
  onOpenSettings?: () => void;
}) {
  return (
    <section className="px-5 pb-6 pt-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#C9A57B] font-serif text-xl font-semibold text-white">
            {patient.initials}
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-[26px] font-normal leading-none tracking-[-0.5px] text-[#2B2622]">
              {patient.name}
            </h1>
            <p className="mt-1 text-[11.5px] text-[#8A7F71]">
              {patient.age} · {patient.room}
            </p>
          </div>
        </div>

        {onOpenSettings ? (
          <button
            type="button"
            aria-label="Settings"
            onClick={onOpenSettings}
            className="flex size-10 items-center justify-center rounded-xl border border-[#DCD2C2]/50 bg-[#F2EEE7]/50 text-[#8A7F71] transition hover:bg-[#EBE4D8] active:scale-[0.97]"
          >
            <SettingsIcon />
          </button>
        ) : null}
      </div>
      <p className="m-0 px-1 font-serif text-[15.5px] italic leading-[1.45] text-[#4F4740]">
        &quot;{patient.oneLine}&quot;
      </p>
    </section>
  );
}
