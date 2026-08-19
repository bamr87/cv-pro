---
name: Tailor the CV to a job description
about: Ask the resident agent to draft a role-tailored CV variant from a JD
title: "tailor: <company> — <role>"
labels: ["tailoring"]
---

<!-- Paste the job description below, then submit. The @claude mention at the
     bottom hands the task to the agent workflow (.github/workflows/claude.yml). -->

## Job description

```text
PASTE THE JOB DESCRIPTION HERE
```

Link (optional): <!-- posting URL -->

## Instructions for the agent

@claude Tailor the CV to the job description above:

1. Save the JD as `jd/<company>-<role-slug>.md` (see existing files in `jd/` for the format).
2. Propose a tailored variant: reorder/trim `data/cv.json` content into `jd/<company>-<role-slug>.tailored.json` (same CVData schema — do NOT change `data/cv.json` itself), emphasizing the experience, projects, and skills the JD calls for. Never invent facts.
3. Generate its Markdown render alongside it for review: `npx tsx -e` with the builder, or describe the diff in the PR body.
4. Open a PR with the JD file + tailored variant and summarize what was emphasized/dropped and why.
