"""StubKnowledgeStore — canned data for demo and smoke tests."""

import uuid

from care_passport.knowledge.models import (
    CompletenessReport,
    Document,
    Episode,
    HotMoments,
    IngestResult,
    Message,
    NamedContact,
    Passport,
    PassportField,
    QueryAnswer,
    TimelineEvent,
)

_ANNA_PASSPORT = Passport(
    patient_id="anna",
    fields=[
        PassportField(
            category="identity",
            statement="Anna prefers to be called 'Nan' by staff.",
            confidence=0.95,
            last_confirmed_at="2025-04-01T10:00:00",
            source_ids=["ep-001"],
        ),
        PassportField(
            category="medical",
            statement="Diagnosed with vascular dementia, moderate stage.",
            confidence=0.98,
            last_confirmed_at="2025-03-15T09:00:00",
            source_ids=["ep-002"],
        ),
        PassportField(
            category="medical",
            statement="Takes Donepezil 10mg each morning with breakfast.",
            confidence=0.97,
            last_confirmed_at="2025-04-10T08:30:00",
            source_ids=["ep-003"],
        ),
        PassportField(
            category="preference",
            statement="Loves Frank Sinatra — especially 'My Way'. Becomes calm when it plays.",
            confidence=0.99,
            last_confirmed_at="2025-04-20T14:00:00",
            source_ids=["ep-004"],
        ),
        PassportField(
            category="behaviour",
            statement="Becomes agitated when routines change unexpectedly.",
            confidence=0.92,
            last_confirmed_at="2025-04-18T16:00:00",
            source_ids=["ep-005"],
        ),
    ],
)

_ANNA_HOT_MOMENTS = HotMoments(
    calmers=["Play Frank Sinatra — 'My Way'", "Hold her hand and hum softly", "Offer a warm cup of tea"],
    agitators=["Sudden changes to her routine", "Bright overhead lights", "More than two strangers at once"],
    soothing_phrase="It's okay Nan, you're safe here. Shall we put on Frank?",
    named_contact=NamedContact(name="David Kowalski", relationship="Son", phone="+44 7700 900123"),
)

_ANNA_COMPLETENESS = CompletenessReport(
    pzp_coverage={
        "wedge_1_identity": 0.9,
        "wedge_2_medical": 0.85,
        "wedge_3_preferences": 0.8,
        "wedge_4_behaviour": 0.7,
        "wedge_5_social": 0.5,
        "wedge_6_spiritual": 0.2,
    },
    hot_moment_readiness={
        "calmers_count": 3,
        "agitators_count": 3,
        "soothing_phrase_present": True,
        "named_contact_present": True,
    },
    overall_score=0.66,
)

_ANNA_TIMELINE = [
    TimelineEvent(
        event_id="ev-001",
        patient_id="anna",
        kind="voice_call",
        summary="Anna's son David called to update medication schedule.",
        occurred_at="2025-04-20T14:00:00",
        channel="voice",
    ),
    TimelineEvent(
        event_id="ev-002",
        patient_id="anna",
        kind="whatsapp",
        summary="Anna mentioned she hasn't been sleeping well.",
        occurred_at="2025-04-19T21:30:00",
        channel="whatsapp",
    ),
    TimelineEvent(
        event_id="ev-003",
        patient_id="anna",
        kind="staff_note",
        summary="Morning shift — Anna was distressed at breakfast, calmed by music.",
        occurred_at="2025-04-18T09:15:00",
        channel="shift_app",
    ),
]


class StubKnowledgeStore:
    async def ingest_episode(self, patient_id: str, episode: Episode) -> IngestResult:
        return IngestResult(episode_id=f"stub-{uuid.uuid4().hex[:8]}", status="ingested")

    async def query(self, patient_id: str, messages: list[Message]) -> list[Document]:
        if patient_id == "anna":
            return [
                Document(
                    content="Anna prefers to be called 'Nan'. She loves Frank Sinatra.",
                    similarity=0.95,
                    uuid="doc-001",
                ),
                Document(
                    content="Anna takes Donepezil 10mg each morning. Vascular dementia, moderate.",
                    similarity=0.88,
                    uuid="doc-002",
                ),
            ]
        return []

    async def get_passport(self, patient_id: str) -> Passport:
        if patient_id == "anna":
            return _ANNA_PASSPORT
        return Passport(patient_id=patient_id)

    async def get_hot_moments(self, patient_id: str) -> HotMoments:
        if patient_id == "anna":
            return _ANNA_HOT_MOMENTS
        return HotMoments()

    async def get_completeness(self, patient_id: str) -> CompletenessReport:
        if patient_id == "anna":
            return _ANNA_COMPLETENESS
        return CompletenessReport(
            pzp_coverage={f"wedge_{i}": 0.0 for i in range(1, 7)},
            hot_moment_readiness={
                "calmers_count": 0,
                "agitators_count": 0,
                "soothing_phrase_present": False,
                "named_contact_present": False,
            },
            overall_score=0.0,
        )

    async def get_timeline(self, patient_id: str, limit: int = 50) -> list[TimelineEvent]:
        if patient_id == "anna":
            return _ANNA_TIMELINE[:limit]
        return []

    async def answer_query(self, patient_id: str, question: str) -> QueryAnswer:
        if patient_id == "anna":
            return QueryAnswer(
                question=question,
                answer="Based on the care passport, Anna responds well to Frank Sinatra and prefers a calm routine.",
                confidence=0.8,
                evidence=["ep-004", "ep-005"],
                uncertainty="Stub data — real inference not yet wired.",
            )
        return QueryAnswer(
            question=question,
            answer="No data available for this patient.",
            confidence=0.0,
            uncertainty="Unknown patient.",
        )
