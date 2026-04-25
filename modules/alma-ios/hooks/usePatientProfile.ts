"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { almaIosApi } from "../api";
import type { ContributionInput, PatientProfile, QueryAnswer } from "../types";

const DEFAULT_PATIENT_ID =
  process.env.NEXT_PUBLIC_CARE_PASSPORT_PATIENT_ID ??
  (process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL ? "anna" : "david");

export function usePatientProfile(patientId = DEFAULT_PATIENT_ID) {
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryAnswer, setQueryAnswer] = useState<QueryAnswer | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [contributionLoading, setContributionLoading] = useState(false);
  const [contributionMessage, setContributionMessage] = useState<string | null>(
    null,
  );

  const refreshPatientProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextPatient = await almaIosApi.getPatientProfile(patientId);
      setPatient(nextPatient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    let cancelled = false;

    almaIosApi
      .getPatientProfile(patientId)
      .then((nextPatient) => {
        if (!cancelled) {
          setPatient(nextPatient);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load profile.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const queryPatient = useCallback(
    async (question: string) => {
      setQueryLoading(true);
      setQueryAnswer(null);
      setError(null);

      try {
        const answer = await almaIosApi.queryPatient(patientId, question);
        setQueryAnswer(answer);
        return answer;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not ask Alma.");
        return null;
      } finally {
        setQueryLoading(false);
      }
    },
    [patientId],
  );

  const postContribution = useCallback(
    async (contribution: ContributionInput) => {
      setContributionLoading(true);
      setContributionMessage(null);
      setError(null);

      try {
        await almaIosApi.postContribution(patientId, contribution);
        setContributionMessage("Saved to the Care Passport.");
        await refreshPatientProfile();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not save contribution.",
        );
      } finally {
        setContributionLoading(false);
      }
    },
    [patientId, refreshPatientProfile],
  );

  return useMemo(
    () => ({
      patient,
      loading,
      error,
      queryAnswer,
      queryLoading,
      contributionLoading,
      contributionMessage,
      refreshPatientProfile,
      queryPatient,
      postContribution,
    }),
    [
      patient,
      loading,
      error,
      queryAnswer,
      queryLoading,
      contributionLoading,
      contributionMessage,
      refreshPatientProfile,
      queryPatient,
      postContribution,
    ],
  );
}
