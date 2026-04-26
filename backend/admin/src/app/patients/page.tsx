import { apiJson } from "@/lib/api";
import { PatientsClient } from "./patients-client";

type Patient = { patient_id: string; workflow_id: string; status: string };

export default async function PatientsPage() {
  let patients: Patient[] = [];
  try {
    const data = await apiJson<{ patients: Patient[] }>("/patients");
    patients = data.patients;
  } catch {
    // show empty state if API is down
  }

  return <PatientsClient initialPatients={patients} />;
}
