import type {
  CompletenessReportDto,
  PassportDto,
  PatientProfile,
  Preference,
  QueryAnswer,
} from "../types";

function toTitleCase(value: string): string {
  return value.trim().split(/\s+/).filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function titleFromStatement(statement: string) {
  const clean = statement.trim();
  const [firstSentence] = clean.split(/[.!?]/);
  return (firstSentence || clean).slice(0, 80);
}

function triggerHintFromCategory(category?: string) {
  switch ((category ?? "").toLowerCase()) {
    case "preference": return "When the moment to use this comes up";
    case "behaviour":
    case "behavior": return "When this behaviour appears in care";
    case "medical": return "During medication or clinical handover";
    case "identity": return "When greeting or addressing the resident";
    default: return "When the moment to use this comes up";
  }
}

function dateFromIso(value?: string | null) {
  if (!value) return "Source in passport";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function summaryFromPassport(passport?: PassportDto) {
  const identityField = passport?.fields.find((field) =>
    ["identity", "personhood", "values"].includes(field.category.toLowerCase()),
  );

  return identityField?.statement ?? "Care Passport loaded from the database.";
}

export function mapPassportToPreferences(passport?: PassportDto): Preference[] {
  if (!passport?.fields?.length) return [];
  return passport.fields.map((field) => ({
    name: titleFromStatement(field.statement),
    trigger: triggerHintFromCategory(field.category),
    note: field.statement,
    source: field.category
      ? field.category.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Care Passport",
    date: dateFromIso(field.last_confirmed_at),
  }));
}

function gapsFromCompleteness(completeness?: CompletenessReportDto) {
  if (!completeness?.pzp_coverage) return [];
  const weakWedges = Object.entries(completeness.pzp_coverage)
    .filter(([, score]) => score < 0.5)
    .map(([wedge]) => ({ question: `What should we still learn about ${wedge.replaceAll("_", " ")}?` }));
  return weakWedges;
}

export function mapApiToPatientProfile({
  patientId, passport, completeness,
}: {
  patientId: string;
  passport?: PassportDto;
  completeness?: CompletenessReportDto;
}): PatientProfile {
  const displayName = toTitleCase(patientId.replaceAll("-", " "));
  return {
    id: patientId,
    name: displayName,
    initials: displayName.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
    age: 0,
    room: "Care Passport",
    oneLine: summaryFromPassport(passport),
    unanswered: gapsFromCompleteness(completeness),
    preferences: mapPassportToPreferences(passport),
  };
}

export function mapQueryAnswer(body: unknown, question: string): QueryAnswer {
  if (!body || typeof body !== "object") {
    return { question, answer: "No structured answer returned by the API.", confidence: 0, evidence: [], uncertainty: "No structured answer returned by the API." };
  }
  const answer = body as Partial<QueryAnswer>;
  return {
    question: typeof answer.question === "string" ? answer.question : question,
    answer: typeof answer.answer === "string" && answer.answer.length > 0 ? answer.answer : "No structured answer returned by the API.",
    confidence: typeof answer.confidence === "number" ? answer.confidence : 0.5,
    evidence: Array.isArray(answer.evidence) ? answer.evidence : [],
    uncertainty: typeof answer.uncertainty === "string" ? answer.uncertainty : null,
  };
}
