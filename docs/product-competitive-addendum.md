# Fennby Product Competitive Addendum

**Status:** Product specification addendum. This document captures the competitor-informed
decisions behind Fennby's main learning features and turns them into build requirements.

Fennby is not copying competitor products directly. The useful ideas are being reworked around
Fennby's own non-negotiables: parent transparency, safeguarding, tutor quality controls,
DB-enforced access rules, and one joined learning record across live tutoring, AI tutoring,
self-study, mocks, and school-facing progress.

## Reference Competitors

| Competitor | Why it matters to Fennby |
|---|---|
| GoStudent | The broadest comparable learning operation: live tutoring, purpose-built classroom, quizzes, self-study, Seneca, and tutor marketplace assets. |
| Preply | Strong validation for the human-tutor marketplace plus technology model. |
| BYJU'S | A cautionary scale case: capital alone does not protect an education business without operational discipline. |
| MyEdSpace | The closest UK-region and age-range reference for live group learning, anonymous peer participation, near-peer mentoring, and outcome-led trust. |

## GoStudent Influences

### GoClass to The Cradle

**Taken:** A purpose-built live classroom with video and a collaborative whiteboard, instead of
depending on external tools such as Zoom.

**Fennby difference:** The Cradle must feed session records, chat, notes, recording status,
whiteboard artifacts, and safeguarding-relevant events into Fennby's parent-transparency layer.
The parent record is not optional and should not depend on the tutor manually summarising what
happened.

The Cradle also serves vocational and craft supervisors, not only academic tutors. The same
live-room model should support maths explanations, writing feedback, sewing pattern sketches,
shoemaking technique diagrams, and other practical supervision contexts.

### Shared Interactive Whiteboard

**Taken:** A real-time collaborative whiteboard alongside video so tutor and learner can work
through diagrams, calculations, annotations, and written explanations visually.

**Fennby difference:** Whiteboard work must persist as part of the session record. A parent
should be able to review what was worked through after the session, alongside the chat, recording
status, tutor notes, and Wrap-Up result.

Whiteboard participation must also respect peer-anonymity mode. In group sessions, children may
hide face/camera identity from other learners while still contributing visible work on the board.
That means whiteboard marks may be participant-attributed to display names or aliases for peers,
while remaining fully visible to the child's parent and authorised safeguarding reviewers.

### Magic Quizzes to The Wrap-Up

**Taken:** A quick end-of-lesson quiz that checks what stuck.

**Fennby difference:** The Wrap-Up is not limited to live tutoring. It must work after Cradle
sessions, Workshop practice, AI Tutor conversations, and relevant mock-prep journeys. Results
must flow into the same assessment, topic-performance, revision, and parent-dashboard pipeline.

### GoStudent Learning to The Workshop

**Taken:** A self-study library with adaptive reteaching when a learner gets stuck.

**Fennby difference:** The Workshop is part of the core Fennby plan, not a second paid add-on.
It must reuse the same question bank, assessment scoring, topic-performance model, homework
photo-upload mechanism, and parent visibility layer as the rest of the product.

## Preply Influence

### Tutor Marketplace Plus Technology

**Taken:** The structural proof that a marketplace of human tutors, enhanced by technology, is
a fundable and working model.

**Fennby difference:** Tutor supply must sit behind Fennby's safeguarding model: DBS gating,
approval status, verified credentials, parent-visible records, and auditable session history.
The technology layer should improve matching, lesson quality, follow-up, and transparency rather
than replacing the human tutor as the core supply.

## BYJU'S Influence

### Cautionary Scale Lesson

**Taken:** No direct product feature.

**Fennby difference:** BYJU'S is a warning to keep in Fennby's operating materials: rapid growth
and very large funding do not compensate for weak discipline, trust, or safeguarding. Fennby's
claims, reports, and scale plans should stay evidence-led.

## MyEdSpace Influences

### Anonymous Peer Participation to Cradle Peer-Anonymity Mode

**Taken:** Cameras-off or identity-light participation can reduce pressure in group learning.

**Fennby difference:** Peer anonymity only changes what other learners see. It must not reduce
parent visibility, safeguarding visibility, tutor accountability, or the session record.

### Near-Peer Mentorship

**Taken:** Older student mentors can be a credible, motivating support layer.

**Fennby difference:** Near-peer and alumni mentors should be modelled as a distinct supply type
with their own permissions, safeguarding checks, allowed activities, and parent-visible records.

### Verified Examiner History

**Taken:** Examiner or marker history is a strong trust signal.

**Fennby difference:** This should be a structured, verified tutor-profile field, clearly
separated from unverified self-claims.

### Evidence-Led Outcomes Reporting

**Taken:** Specific outcomes build trust better than vague claims.

**Fennby difference:** Fennby should only publish claims supported by its own data. Dashboards,
impact pages, and school/local-authority reporting should follow the honesty principle: no
marketing stat should outrun the available evidence.

## Build Requirements Raised By This Addendum

### Warm-Up Question Pool

The warm-up system must move from hardcoded local sample data to a real Supabase-backed pool.
Target state:

- More than 1,000 published warm-up-eligible questions.
- Around 10 questions per warm-up.
- Rotation that avoids recently seen questions for the same learner.
- Coverage across maths, English, verbal reasoning, non-verbal reasoning, general knowledge,
  logic, vocabulary, and age-appropriate mixed subjects.
- Stored question IDs, answers, score, duration, subject mix, and completion metadata.
- Parent-visible results and topic-performance updates where appropriate.

### Mock Question Source

Mock exams must draw from published Supabase assessments and linked assessment questions, not
from local sample arrays. A production-ready assessment needs explicit metadata for subject,
exam type, age band, duration, mode, source, accessibility options, and published status.

### Print-Shade Marking

The print-shade journey must become a real upload and marking pipeline:

- Generate or serve the paper and answer sheet.
- Upload completed answer sheet images or PDFs to Supabase Storage.
- Create an assessment attempt in a pending-marking state.
- Run OCR/vision marking against the shaded responses.
- Store extracted answers, confidence scores, and exceptions.
- Route low-confidence sheets to a human review queue.
- Publish final results back to the child and parent dashboards.

Open-source OCR such as Tesseract.js can be evaluated first, with AI vision reserved for cases
where accuracy, handwriting, or sheet quality require it.

### Speech

Current browser-native speech support is acceptable as a low-cost baseline, but it should be
tracked as progressive enhancement. A production decision is still needed on whether to keep
browser Web Speech APIs or add a more consistent speech stack for supported browsers, devices,
and accessibility workflows.

### Cradle Whiteboard Persistence

The shared whiteboard should persist strokes or exported snapshots against the Cradle session.
It should support replay or post-session review, parent visibility, and safeguarding audit
access. Peer-anonymity mode must apply to peer display only, not to parent or safeguarding
records.
