import type { PatientProfile } from "../types";

export function PatientHero({ patient }: { patient: PatientProfile }) {
  return (
    <section className="px-4 pb-3 pt-1">
      <div className="mb-2.5 flex items-center gap-3">
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
      <p className="m-0 font-serif text-[15.5px] italic leading-[1.45] text-[#4F4740]">
        &quot;{patient.oneLine}&quot;
      </p>
    </section>
  );
}
