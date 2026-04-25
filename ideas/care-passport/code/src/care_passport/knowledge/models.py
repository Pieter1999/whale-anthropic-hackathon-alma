"""Pydantic models for the knowledge layer."""

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


class Episode(BaseModel):
    source: str
    transcript: str | None = None
    text: str | None = None
    channel: Literal["voice", "whatsapp", "web", "shift_app"] = "voice"
    captured_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    attribution: dict | None = None


class IngestResult(BaseModel):
    episode_id: str
    status: str = "ingested"


class Message(BaseModel):
    role: str
    content: str


class Document(BaseModel):
    content: str
    similarity: float = 1.0
    uuid: str | None = None


class PassportField(BaseModel):
    category: str
    statement: str
    confidence: float = 1.0
    last_confirmed_at: str | None = None
    source_ids: list[str] = Field(default_factory=list)


class Passport(BaseModel):
    patient_id: str
    fields: list[PassportField] = Field(default_factory=list)


class NamedContact(BaseModel):
    name: str
    relationship: str
    phone: str | None = None


class HotMoments(BaseModel):
    calmers: list[str] = Field(default_factory=list)
    agitators: list[str] = Field(default_factory=list)
    soothing_phrase: str | None = None
    named_contact: NamedContact | None = None


class CompletenessReport(BaseModel):
    pzp_coverage: dict[str, float] = Field(default_factory=dict)
    hot_moment_readiness: dict = Field(default_factory=dict)
    overall_score: float = 0.0


class TimelineEvent(BaseModel):
    event_id: str
    patient_id: str
    kind: str
    summary: str
    occurred_at: str
    channel: str | None = None
    attribution: dict | None = None


class QueryAnswer(BaseModel):
    question: str
    answer: str
    confidence: float = 1.0
    evidence: list[str] = Field(default_factory=list)
    uncertainty: str | None = None
