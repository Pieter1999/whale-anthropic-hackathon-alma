import { apiJson } from "@/lib/api";
import { PatientTabs } from "./patient-tabs";

type Props = { params: Promise<{ id: string }> };

export default async function PatientPage({ params }: Props) {
  const { id } = await params;

  const [passport, hotMoments, completeness, timeline] = await Promise.allSettled([
    apiJson<Record<string, unknown>>(`/patients/${id}/passport`),
    apiJson<Record<string, unknown>>(`/patients/${id}/hot-moments`),
    apiJson<Record<string, unknown>>(`/patients/${id}/completeness`),
    apiJson<Record<string, unknown>>(`/patients/${id}/timeline`),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold font-mono">{id}</h1>
      <PatientTabs
        patientId={id}
        passport={passport.status === "fulfilled" ? passport.value : null}
        hotMoments={hotMoments.status === "fulfilled" ? hotMoments.value : null}
        completeness={completeness.status === "fulfilled" ? completeness.value : null}
        timeline={timeline.status === "fulfilled" ? timeline.value : null}
      />
    </div>
  );
}
