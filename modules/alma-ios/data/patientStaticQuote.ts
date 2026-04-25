import { davidProfile } from "./davidProfile";

const ANNA_ONE_LINE =
  "Former stage performer. Familiar music calms her. Best with a soft, quiet voice.";

export function getStaticQuoteForPatient(patientId: string): { oneLine: string } {
  if (patientId === "anna") {
    return { oneLine: ANNA_ONE_LINE };
  }
  return { oneLine: davidProfile.oneLine };
}
