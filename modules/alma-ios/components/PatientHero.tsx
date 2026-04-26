import type { PatientProfile } from "../types";

export function PatientHero({ patient }: { patient: PatientProfile }) {
  return (
    <section className="px-4 pb-3 pt-1">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#1A3829] text-xl font-semibold text-[#F5EDD8]">
          {patient.initials}
        </div>
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold leading-none tracking-[-0.5px] text-[#1A3829]">
            {patient.name}
          </h1>
          <p className="mt-1 text-[11.5px] text-[#6B7B72]">
            {patient.age} · {patient.room}
          </p>
        </div>
      </div>
      <p className="font-caveat text-[17px] leading-[1.4] text-[#C8923A]">
        &quot;{patient.oneLine}&quot;
      </p>
    </section>
  );
}
