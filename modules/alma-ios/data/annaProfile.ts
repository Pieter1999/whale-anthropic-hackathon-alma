import type { PatientProfile } from "../types";

export const annaProfile: PatientProfile = {
  id: "anna",
  name: "Anna",
  initials: "AN",
  age: 82,
  room: "Room 7A · East wing",
  oneLine: "Soft classical music and a warm hand on the shoulder bring her back.",
  unanswered: [
    { question: "What does she like to eat these days?" },
    { question: "Are there any new triggers since her room change?" },
  ],
  preferences: [
    {
      title: "Classical music — piano pieces",
      detail:
        "Put on soft classical piano (Chopin, Satie). She hums along and visibly relaxes within a few minutes.",
      source: "Family",
      date: "Care Passport",
    },
    {
      title: "Warm hand + steady voice",
      detail:
        'Place a hand gently on her shoulder and say: "You are safe here, Anna." Repeat calmly if needed.',
      source: "Care team",
      date: "Care Passport",
    },
    {
      title: "Avoid sudden loud noises",
      detail:
        "Loud sounds or multiple people talking at once cause immediate distress. Keep the environment calm and approach one-on-one.",
      source: "Family",
      date: "Care Passport",
    },
    {
      title: "Photo album — family",
      detail:
        "Showing the family photo album brings recognition and comfort. Keep it on her bedside table.",
      source: "Family",
      date: "Care Passport",
    },
  ],
};
