import { davidProfile } from "../data/davidProfile";
import type { CarePassportApi, QueryAnswer } from "../types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockCarePassportApi: CarePassportApi = {
  async getPatientProfile() {
    await wait(120);
    return davidProfile;
  },

  async queryPatient(_patientId, question) {
    await wait(180);

    const answer: QueryAnswer = {
      question,
      answer:
        "Hand him a glass of cold water and speak slowly. If he stays restless, play Frank Sinatra softly and avoid correcting him.",
      confidence: 0.86,
      evidence: [
        "Anne (daughter): A glass of cold water + steady voice",
        'Anne (daughter): Frank Sinatra - "Fly Me to the Moon"',
      ],
      uncertainty: null,
    };

    return answer;
  },

  async postContribution() {
    await wait(160);
  },
};
