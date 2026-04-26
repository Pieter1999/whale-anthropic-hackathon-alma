import { apiJson } from "@/lib/api";
import { PatientsClient } from "./patients-client";

type Patient = { patient_id: string; workflow_id: string; status: string };

function titleCase(id: string) {
  return id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function PatientsPage() {
  let patients: Patient[] = [];
  try {
    const data = await apiJson<{ patients: Patient[] }>("/patients");
    patients = data.patients;
  } catch {
    // show empty state if API is down
  }

  const enriched = patients.map((p) => ({ ...p, display_name: titleCase(p.patient_id) }));

  return <PatientsClient initialPatients={enriched} />;
}
