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
      name: "A glass of cold water + steady voice",
      trigger: "When David is restless or confused after waking",
      note: 'Hand him a glass and say: "You\'ve slept well. You\'re safe here." Works almost every time.',
      source: "Anne (daughter)",
      date: "12 April 2026",
    },
    {
      name: 'Frank Sinatra - "Fly Me to the Moon"',
      trigger: "When David is winding down or after dinner",
      note: "Plays on the small radio in his room. Hums along.",
      source: "Anne (daughter)",
      date: "12 April 2026",
    },
    {
      name: "Old wooden carpenter's pencil",
      trigger: "When David is having a bad day or needs calming",
      note: "He really lights up when I bring his old wooden carpenter's pencil. He turns it in his hands and starts telling stories about the workshop. It calms him down within a minute, even on bad days.",
      source: "Anne (daughter)",
      date: "26 April 2026",
    },
  ],
};
