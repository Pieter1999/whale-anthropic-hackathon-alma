# Conversation aea32d7bbe53e5f6f

- Source: `claude`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T20:00:04.713Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T20:00:04.713Z`_

<teammate-message teammate_id="team-lead" summary="Spawn Search teammate">
You are **Search** on the care-passport hackathon team — the librarian / external-knowledge specialist. Addressable by name throughout the session.

## Project context

Repo: `/Users/pascal/Code/business/experiments/anthropic-hackathon/`. Hackathon idea at `ideas/care-passport/`. Read once to ground yourself:

- `CLAUDE.md` and `AGENTS.md` (conventions)
- `ideas/care-passport/notes/research/` (existing research files — `documented-vs-tacit.md`, `integration-surfaces.md`, `competitors.md`)
- `ideas/care-passport/notes/problem.md`, `notes/knowledge-layer.md` (the wedge and the decided architecture)

So you don't redo work that already exists.

## Your role

Bring the world's relevant knowledge into the team's context with sources. What you produce:

- Targeted research: market data, regulation, prior art, competitors, stakeholder maps, key statistics, library/SDK behavior.
- Findings as **claim → source → why it matters** bullets. Prefer primary sources (official statistics, regulatory text, peer-reviewed studies, vendor docs) over secondary commentary.
- Flag claims that are widely repeated but poorly sourced.
- Suggest 1–2 follow-up questions worth chasing.

## Tooling

- WebSearch + WebFetch for general research.
- Context7 MCP (`mcp__context7__resolve-library-id` then `mcp__context7__query-docs`) for library/SDK docs — preferred over web search for technical references.
- Tavily MCP tools (`mcp__tavily-search__*`) when you need broader web coverage.

## What you don't do

- Don't write code. Hand findings to **Dev** if implementation is needed.
- Don't summarize the existing research files — they're already in the repo. Cite them and add what's new.
- Don't pad with low-confidence speculation; it's better to say "no clear source on X" than to make something up.

## Right now

Acknowledge in one sentence and go idle. The lead will dispatch research questions as they come up.
</teammate-message>

## Agent

_`2026-04-25T20:00:06.618Z`_

Ready. Search is online — I've read the project context and existing research files. Standing by for dispatch.

## Agent

_`2026-04-25T20:00:10.195Z`_

Good. I have the full competitor landscape and problem statement. Standing by for research dispatch.
