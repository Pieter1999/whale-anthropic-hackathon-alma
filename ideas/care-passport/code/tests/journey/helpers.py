"""Adversarial assertion helpers used by the Tavern journey suite.

The journey is intentionally end-to-end against the live `make up` stack and
exercises an LLM-backed extraction path, so exact-string assertions would be
flaky. These helpers express *bounded invariants*: keyword presence, source_id
cross-checks, attribution preservation, and shape sanity. Each helper raises
an AssertionError with a message Tavern surfaces directly into the test report.
"""

from __future__ import annotations

import ast

from tavern._core.dict_util import check_keys_match_recursive  # noqa: F401  (kept as Tavern import sanity)


def _coerce_id_list(value) -> list[str]:
    """Tavern stringifies saved values when interpolated into extra_kwargs;
    this restores them to a list."""
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = ast.literal_eval(value)
            if isinstance(parsed, list):
                return parsed
        except (ValueError, SyntaxError):
            pass
    return []


def _lower_blob(obj) -> str:
    """Recursively flatten any JSON-ish structure into a single lowercase string."""
    if obj is None:
        return ""
    if isinstance(obj, str):
        return obj.lower()
    if isinstance(obj, (int, float, bool)):
        return str(obj).lower()
    if isinstance(obj, dict):
        return " ".join(_lower_blob(v) for v in obj.values())
    if isinstance(obj, (list, tuple)):
        return " ".join(_lower_blob(v) for v in obj)
    return str(obj).lower()


def assert_timeline_grew(response, baseline: int):
    """Assert the timeline now has more events than `baseline`."""
    body = response.json()
    events = body.get("events", [])
    assert len(events) > baseline, (
        f"timeline did not grow after ingestion: baseline={baseline}, now={len(events)}"
    )
    return {"timeline_size": len(events)}


def assert_timeline_min_size(response, minimum: int):
    body = response.json()
    events = body.get("events", [])
    assert len(events) >= minimum, f"timeline has {len(events)} events, expected >= {minimum}"
    for ev in events:
        assert ev.get("captured_at"), f"event missing captured_at: {ev}"
        assert ev.get("event_id") or ev.get("kind"), f"event missing identity: {ev}"
    return {"timeline_event_ids": [e.get("event_id") for e in events if e.get("event_id")]}


def assert_passport_covers_categories(response, required_substrings):
    """Passport must contain at least one field per required category-or-keyword.

    `required_substrings` is a list of lowercase tokens; each must appear in at
    least one field's `category` or `statement`. This is a bounded check — we
    do not require exact category names because the extractor's taxonomy may
    drift between runs.
    """
    body = response.json()
    fields = body.get("fields", [])
    assert len(fields) >= 3, f"passport has {len(fields)} fields, expected >= 3"
    blob = _lower_blob(fields)
    missing = [tok for tok in required_substrings if tok.lower() not in blob]
    assert not missing, (
        f"passport missing expected tokens {missing}; fields blob (truncated): {blob[:400]!r}"
    )
    for f in fields:
        assert "confidence" in f, f"passport field missing confidence: {f}"
        assert "source_ids" in f, f"passport field missing source_ids: {f}"
    return {"passport_field_count": len(fields)}


def assert_completeness_reflects_inputs(response):
    body = response.json()
    coverage = body.get("pzp_coverage") or {}
    readiness = body.get("hot_moment_readiness") or {}
    assert isinstance(coverage, dict) and len(coverage) >= 1, (
        f"pzp_coverage empty/invalid: {coverage}"
    )
    nonzero_wedges = [k for k, v in coverage.items() if isinstance(v, (int, float)) and v > 0]
    assert nonzero_wedges, (
        f"pzp_coverage has no wedges with score > 0; ingestion did not move the needle: {coverage}"
    )
    for key in ("calmers_count", "agitators_count"):
        assert key in readiness, f"hot_moment_readiness missing {key}: {readiness}"
        assert isinstance(readiness[key], int), f"{key} not an int: {readiness}"
    return {"nonzero_wedge_count": len(nonzero_wedges)}


def assert_query_cites_real_sources(response, timeline_event_ids):
    """Query answer must be non-empty AND its evidence must intersect the timeline."""
    body = response.json()
    answer = body.get("answer", "") or ""
    assert answer.strip(), f"query answer is empty: {body}"
    evidence = body.get("evidence") or []
    assert evidence, f"query answered without citing any evidence — pure hallucination risk: {body}"
    cited_note_ids = {e.split("#", 1)[0] for e in evidence}
    overlap = cited_note_ids & set(timeline_event_ids or [])
    assert overlap, (
        f"query evidence {evidence} (note_ids {sorted(cited_note_ids)}) "
        f"does not intersect timeline event_ids {timeline_event_ids}; "
        f"the system cited sources that don't exist in our log"
    )
    return {}


def assert_hot_moments_reflect_inputs(response, expected_calmer_tokens, expected_agitator_tokens):
    body = response.json()
    calmers = body.get("calmers") or []
    agitators = body.get("agitators") or []
    assert isinstance(calmers, list) and isinstance(agitators, list), (
        f"hot_moments calmers/agitators not lists: {body}"
    )
    assert calmers, "hot_moments.calmers is empty after seeding calming routines"
    assert agitators, "hot_moments.agitators is empty after seeding agitator notes"
    calmer_blob = _lower_blob(calmers)
    agitator_blob = _lower_blob(agitators)
    missing_calm = [t for t in expected_calmer_tokens if t.lower() not in calmer_blob]
    missing_agit = [t for t in expected_agitator_tokens if t.lower() not in agitator_blob]
    assert not missing_calm, f"calmers missing expected tokens {missing_calm}; calmers={calmers}"
    assert not missing_agit, (
        f"agitators missing expected tokens {missing_agit}; agitators={agitators}"
    )
    return {}


def assert_kb_documents_seeded(response, required_tokens):
    body = response.json()
    docs = body.get("documents") or []
    assert docs, f"/vapi/kb returned no documents: {body}"
    blob = _lower_blob(docs)
    missing = [t for t in required_tokens if t.lower() not in blob]
    assert not missing, (
        f"/vapi/kb response missing seeded tokens {missing}; docs blob: {blob[:400]!r}"
    )
    return {}


def assert_attribution_preserved(response, expected_kinds):
    """Walk timeline events; assert each `expected_kinds` value appears at least once.

    `expected_kinds` is a list like ["patient", "family", "staff"]. Catches the
    bug where ingestion flattens attribution and surfaces every contribution as
    if it came from the patient.
    """
    body = response.json()
    events = body.get("events") or []
    found = set()
    for ev in events:
        attr = ev.get("attribution") or {}
        kind = attr.get("kind") if isinstance(attr, dict) else None
        if kind:
            found.add(kind)
    missing = [k for k in expected_kinds if k not in found]
    assert not missing, f"timeline lost attribution kinds {missing}; observed kinds={sorted(found)}"
    return {}


def assert_patient_listed(response, patient_id):
    body = response.json()
    patients = body.get("patients") or []
    ids = {p.get("patient_id") for p in patients}
    assert patient_id in ids, f"patient {patient_id} not in /patients list: {ids}"
    return {}


def assert_patient_not_listed(response, patient_id):
    body = response.json()
    patients = body.get("patients") or []
    ids = {p.get("patient_id") for p in patients}
    assert patient_id not in ids, (
        f"patient {patient_id} still in /patients list after delete: {ids}"
    )
    return {}
