"""Tail parser/serializer for markdown bullets.

Tail format: {confidence: high, sources: [n_004#c_2], first_seen: 2026-04-12, ...}
"""

import re
from typing import Literal

from pydantic import BaseModel, Field

_TAIL_RE = re.compile(r"^(.*?)\s*\{([^}]+)\}\s*$", re.DOTALL)
_LIST_RE = re.compile(r"\[([^\]]*)\]")


class Bullet(BaseModel):
    text: str
    confidence: Literal["high", "medium", "low"] = "high"
    sources: list[str] = Field(default_factory=list)
    first_seen: str | None = None
    last_confirmed: str | None = None
    status: Literal["active", "needs_review", "superseded"] = "active"
    attributed: str | None = None
    by: str | None = None


def parse_bullet(line: str) -> Bullet | None:
    """Parse a markdown bullet line with optional tail. Returns None if not a bullet."""
    stripped = line.strip()
    if not stripped.startswith("- "):
        return None
    content = stripped[2:]

    m = _TAIL_RE.match(content)
    if not m:
        return Bullet(text=content.strip())

    text = m.group(1).strip()
    tail_raw = m.group(2)

    tail: dict = {}
    for part in _split_tail_parts(tail_raw):
        if ":" not in part:
            continue
        k, _, v = part.partition(":")
        k = k.strip()
        v = v.strip()
        lm = _LIST_RE.match(v)
        if lm:
            items = [x.strip() for x in lm.group(1).split(",") if x.strip()]
            tail[k] = items
        else:
            tail[k] = v

    return Bullet(
        text=text,
        confidence=tail.get("confidence", "high"),
        sources=tail.get("sources", []),
        first_seen=tail.get("first_seen"),
        last_confirmed=tail.get("last_confirmed"),
        status=tail.get("status", "active"),
        attributed=tail.get("attributed"),
        by=tail.get("by"),
    )


def format_bullet(bullet: Bullet) -> str:
    """Serialize a Bullet back to a markdown bullet line with tail."""
    parts: list[str] = [f"confidence: {bullet.confidence}"]

    if bullet.sources:
        src_list = ", ".join(bullet.sources)
        parts.append(f"sources: [{src_list}]")
    if bullet.first_seen:
        parts.append(f"first_seen: {bullet.first_seen}")
    if bullet.last_confirmed:
        parts.append(f"last_confirmed: {bullet.last_confirmed}")
    if bullet.status != "active":
        parts.append(f"status: {bullet.status}")
    if bullet.attributed:
        parts.append(f"attributed: {bullet.attributed}")
    if bullet.by:
        parts.append(f"by: {bullet.by}")

    tail = ", ".join(parts)
    return f"- {bullet.text} {{{tail}}}"


def _split_tail_parts(tail_raw: str) -> list[str]:
    """Split tail string on commas that are not inside brackets."""
    parts = []
    depth = 0
    current: list[str] = []
    for ch in tail_raw:
        if ch == "[":
            depth += 1
            current.append(ch)
        elif ch == "]":
            depth -= 1
            current.append(ch)
        elif ch == "," and depth == 0:
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(ch)
    if current:
        parts.append("".join(current).strip())
    return parts
