"""
Patient ontology — EXTENSION POINT.

Add Pydantic entity types here. Each class becomes a node type in the
Graphiti knowledge graph. Pass them as `entity_types` to `add_episode`.

Pascal: replace / extend the toy Symptom below with the real patient model.
"""

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# TODO: Define the full patient ontology here.
# Each class should inherit from BaseModel and describe one entity type.
# Examples: Diagnosis, Medication, Allergy, Appointment, LabResult, ...
# ---------------------------------------------------------------------------


class Symptom(BaseModel):
    """Toy entity — demonstrates the wiring. Replace with real ontology."""

    name: str = Field(description="Name of the symptom, e.g. 'headache'")
    severity: str | None = Field(default=None, description="mild / moderate / severe")
    duration: str | None = Field(default=None, description="How long the symptom has lasted")


# Registry consumed by memory.py — add new types here as you extend the ontology.
ENTITY_TYPES: list[type[BaseModel]] = [Symptom]
