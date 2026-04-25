export type Preference = {
  title: string;
  detail: string;
  source: string;
  date: string;
};

export type KnowledgeGap = {
  question: string;
};

export type PatientProfile = {
  id: string;
  name: string;
  initials: string;
  age: number;
  room: string;
  oneLine: string;
  unanswered: KnowledgeGap[];
  preferences: Preference[];
};

export type PassportFieldDto = {
  category: string;
  statement: string;
  confidence: number;
  last_confirmed_at?: string | null;
  source_ids?: string[];
};

export type PassportDto = {
  patient_id: string;
  fields: PassportFieldDto[];
};

export type HotMomentsDto = {
  calmers?: string[];
  agitators?: string[];
  soothing_phrase?: string | null;
  named_contact?: {
    name: string;
    relationship: string;
    phone?: string | null;
  } | null;
};

export type CompletenessReportDto = {
  pzp_coverage?: Record<string, number>;
  hot_moment_readiness?: Record<string, unknown>;
  overall_score?: number;
};

export type QueryAnswer = {
  question: string;
  answer: string;
  confidence: number;
  evidence: string[];
  uncertainty?: string | null;
};

export type ContributionInput = {
  text: string;
  channel?: "web" | "voice" | "whatsapp" | "shift_app";
  attribution?: Record<string, unknown>;
  captured_at?: string;
};

export type CarePassportApi = {
  getPatientProfile: (patientId: string) => Promise<PatientProfile>;
  queryPatient: (patientId: string, question: string) => Promise<QueryAnswer>;
  postContribution: (
    patientId: string,
    contribution: ContributionInput,
  ) => Promise<void>;
};
