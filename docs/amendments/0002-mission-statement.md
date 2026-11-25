<!-- kit: governance v0.1.0 -->
# 0002 — Missions

- **Status:** ratified
- **Date:** 2026-11-16
- **Proposed by:** Grok Bot (agent), at the maintainer's request
- **Ratified by:** https://github.com/bamr87/cv-pro/pull/23
- **Affects:** constitution §1; PRD §1.1; feature CVPRO-007
- **Supersedes:** none
- **Related:** [app/PRD.md](../../app/PRD.md) §1.1; feature CVPRO-007

## Context

Constitution §1 Mission was a product description (or, for a new constitution, had not been written yet), not a three-mission direction statement. The fleet now requires every repo's constitution §1 to be one direction statement followed by exactly three numbered missions, adopted through a numbered amendment the maintainer ratifies by merging. The maintainer asked for those missions to be comprehensive and epic: CV Pro as the ultimate open home for all things professional CVs. Mission 1 follows the maintainer's wording, adapted to this domain: provide data, tools, resources and transparency for all stakeholders, domain practitioners and the general public. The ambition is the direction, not a claim that the work is already finished. The missions are aligned with this repo's existing constitution and PRD.

## Amendment

Replace constitution §1 with the following, retitled **Missions**:

CV Pro's direction is to become the ultimate open home for all things professional CVs — data, tools, resources and transparency, gathered in one place that anyone can inspect and reuse.

1. **Provide data, tools, resources and transparency for all stakeholders, job seekers, hiring professionals and the general public.** Authors, reviewers and anyone presenting their work are first-class audiences. The aim is a shared, inspectable commons: the same CV data, the same contract, and the same renders for everyone.
2. **Treat the CV as code: a single canonical data contract that feeds professional LaTeX typesetting and multi-format export (PDF, Markdown, ASCII and LaTeX source), with a builder that edits that contract rather than a one-off document.** The data, the contract and the renders live together so the builder and the published CV cannot silently drift.
3. **Make getting a CV into that contract effortless and honest: parse an existing CV with AI, then always leave the author in control to review, edit and fall back to manual entry when parsing fails.** Intelligence should save time without inventing a career, and every export should stay complete and professional.

These missions set the course; they do not claim the work is finished. They serve the PRD's essential features: CV data management, a LaTeX template system, an AI CV parser, multi-format export and a template gallery.

_Source: [app/PRD.md](../app/PRD.md) §1.1._


Existing §1 normative content is preserved under the missions, not dropped:

### Edge case handling

These handling rules remain in force and were previously the whole of §1:

- Empty CV data: display guided onboarding with sample data and clear next steps.
- AI parsing failures: graceful fallback with manual entry options and error explanations.
- Large file uploads: progress indicators and file size limits with helpful messaging.
- LaTeX compilation errors: error reporting with suggested fixes and template fallbacks.
- Missing sections: smart defaults and optional section handling.

## Consequences

Agents and reviewers judge fit against these three missions before inventing scope, treating them as the direction of the repo rather than a description of what already ships. The same text is added as PRD §1.1 so the constitution's `_Source:` line stays accurate. The original PRD purpose / overview paragraph is left in place. This PR also aligns the README and AGENTS.md taglines with the missions and links them to constitution §1, and adds feature CVPRO-007 to the feature catalog, traced to requirement MR1. Merging this PR ratifies amendment 0002. Until then the record stays `Status: proposed`.
