import type {
  CarePassportApi,
  CompletenessReportDto,
  ContributionInput,
  HotMomentsDto,
  PassportDto,
} from "../types";
import { mapApiToPatientProfile, mapQueryAnswer } from "./mappers";

const API_BASE_URL = process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Care Passport API ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function requestOptionalJson<T>(path: string): Promise<T | undefined> {
  try {
    return await requestJson<T>(path);
  } catch {
    return undefined;
  }
}

export const carePassportApi: CarePassportApi = {
  async getPatientProfile(patientId) {
    const [passport, completeness, hotMoments] = await Promise.all([
      requestOptionalJson<PassportDto>(`/patients/${patientId}/passport`),
      requestOptionalJson<CompletenessReportDto>(
        `/patients/${patientId}/completeness`,
      ),
      requestOptionalJson<HotMomentsDto>(`/patients/${patientId}/hot-moments`),
    ]);

    return mapApiToPatientProfile({
      patientId,
      passport,
      completeness,
      hotMoments,
    });
  },

  async queryPatient(patientId, question) {
    const body = await requestJson<unknown>(`/patients/${patientId}/query`, {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    return mapQueryAnswer(body, question);
  },

  async postContribution(patientId, contribution: ContributionInput) {
    await requestJson(`/patients/${patientId}/contributions`, {
      method: "POST",
      body: JSON.stringify({
        text: contribution.text,
        channel: contribution.channel ?? "web",
        attribution: contribution.attribution ?? {},
        captured_at: contribution.captured_at,
      }),
    });
  },
};
