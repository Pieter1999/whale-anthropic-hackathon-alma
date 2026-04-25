import { davidProfile } from "../data/davidProfile";
import type {
  CompletenessReportDto,
  HotMomentsDto,
  PassportDto,
  PatientProfile,
  Preference,
  QueryAnswer,
} from "../types";

function titleFromStatement(statement: string) {
  const clean = statement.trim();
  const [firstSentence] = clean.split(/[.!?]/);
  return (firstSentence || clean).slice(0, 80);
}

function dateFromIso(value?: string | null) {
  if (!value) {
    return "Source in passport";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function mapPassportToPreferences(passport?: PassportDto): Preference[] {
  if (!passport?.fields?.length) {
    return davidProfile.preferences;
  }

  return passport.fields.map((field) => ({
    title: titleFromStatement(field.statement),
    detail: field.statement,
    source: field.source_ids?.length
      ? field.source_ids.join(", ")
      : `${field.category} · ${Math.round(field.confidence * 100)}% confidence`,
    date: dateFromIso(field.last_confirmed_at),
  }));
}

function gapsFromCompleteness(completeness?: CompletenessReportDto) {
  if (!completeness?.pzp_coverage) {
    return davidProfile.unanswered;
  }

  const weakWedges = Object.entries(completeness.pzp_coverage)
    .filter(([, score]) => score < 0.5)
    .map(([wedge]) => ({
      question: `What should we still learn about ${wedge.replaceAll("_", " ")}?`,
    }));

  return weakWedges.length > 0 ? weakWedges : davidProfile.unanswered;
}

function oneLineFromHotMoments(hotMoments?: HotMomentsDto) {
  const calmer = hotMoments?.calmers?.[0];
  const phrase = hotMoments?.soothing_phrase;

  if (calmer && phrase) {
    return `${calmer}. Suggested phrase: "${phrase}"`;
  }

  return davidProfile.oneLine;
}

export function mapApiToPatientProfile({
  patientId,
  passport,
  completeness,
  hotMoments,
}: {
  patientId: string;
  passport?: PassportDto;
  completeness?: CompletenessReportDto;
  hotMoments?: HotMomentsDto;
}): PatientProfile {
  const fallback = davidProfile;
  const displayName =
    patientId === fallback.id ? fallback.name : patientId.replaceAll("-", " ");

  return {
    ...fallback,
    id: patientId,
    name: displayName,
    initials: displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    oneLine: oneLineFromHotMoments(hotMoments),
    unanswered: gapsFromCompleteness(completeness),
    preferences: mapPassportToPreferences(passport),
  };
}

export function mapQueryAnswer(body: unknown, question: string): QueryAnswer {
  if (!body || typeof body !== "object") {
    return {
      question,
      answer: davidProfile.oneLine,
      confidence: 0,
      evidence: [],
      uncertainty: "No structured answer returned by the API.",
    };
  }

  const answer = body as Partial<QueryAnswer>;

  return {
    question: typeof answer.question === "string" ? answer.question : question,
    answer:
      typeof answer.answer === "string" && answer.answer.length > 0
        ? answer.answer
        : davidProfile.oneLine,
    confidence:
      typeof answer.confidence === "number" ? answer.confidence : 0.5,
    evidence: Array.isArray(answer.evidence) ? answer.evidence : [],
    uncertainty:
      typeof answer.uncertainty === "string" ? answer.uncertainty : null,
  };
}
