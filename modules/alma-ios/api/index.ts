import type { CarePassportApi } from "../types";
import { carePassportApi } from "./carePassportApi";
import { mockCarePassportApi } from "./mockCarePassportApi";

const shouldUseMock =
  process.env.NEXT_PUBLIC_CARE_PASSPORT_USE_MOCK === "true";

export const almaIosApi: CarePassportApi = shouldUseMock
  ? mockCarePassportApi
  : carePassportApi;
