import type { PatientProfile } from "../types";

export const davidProfile: PatientProfile = {
  id: "david",
  name: "David Vermeer",
  initials: "DV",
  age: 78,
  room: "Room 14B · West wing",
  oneLine: "Retired carpenter. Speaks softly. Calmer with hands occupied.",
  unanswered: [
    { question: "What does he like to eat these days?" },
    { question: "Is the evening hall light still the one he wants left on?" },
    { question: "What are his grandchildren's names in his own words?" },
  ],
  preferences: [
    {
      title: "A glass of cold water + steady voice",
      detail: 'Hand him a glass and say: "You\'ve slept well. You\'re safe here." Works almost every time.',
      source: "Anne (daughter)",
      date: "12 April 2026",
    },
    {
      title: 'Frank Sinatra - "Fly Me to the Moon"',
      detail: "Plays on the small radio in his room. Hums along.",
      source: "Anne (daughter)",
      date: "12 April 2026",
    },
  ],
};
