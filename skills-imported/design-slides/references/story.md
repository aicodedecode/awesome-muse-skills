# Deck plan

## A claim, not a topic

Each plan row says what the slide proves. "Market" is a topic. "Independent bakeries throw away a fifth of the bread they bake" is a claim (an invented example). If the claim cannot be written, the slide is not needed or lacks data.

## Slide job and layout

Every slide in the plan has a job and a layout for it, with the reason. The jobs below are examples, not a closed list. Another job is fine: write down which layout it needs and why.

| Job | Layout hint |
|---|---|
| title | the name and one claim, large |
| problem | one sentence or one scene, no list |
| one number | the number across the slide, caption and source small |
| change over time | a chart by period with labeled values |
| comparison | a table or two columns, your own row highlighted |
| steps | a sequence left to right or top to bottom |
| product | a real screen, mockup or demo; text beside it, not on top |
| how the system works | a diagram of connections |
| geography | a map or a list of regions with numbers |
| people | photo, name, role, one line of experience |
| quote | the quote large, the author small |
| ask | the amount or the action and what it is for, no decoration |

Two slides with different jobs do not share a layout unless an approved template sets it. Two slides with the same job use the same layout.

Plan row format: `claim · job · layout (reason)`.

## Required parts by deck type

| Type | Parts |
|---|---|
| investor pitch | problem, product, proof of demand (revenue, users, pilots), market, alternatives or competitors, team with proof of scale (what they built, how many users, not only titles), the ask with what the money is for |
| work showcase | the task and constraints, the solution, how it beats what came before, what is next |
| talk | the question, how the answer unfolds, the conclusion, what the listener will do differently |
| internal report | the period's result, deviations from plan and their causes, decisions needed |

The appendix does not repeat the main part: it holds only what the main part lacks.

## Source table

| Claim | Number | Source | Period | Units | Status |
|---|---|---|---|---|---|
| Active users | 3,400 | analytics dashboard | September 2026 | people per month | fact |

- **Status.** Fact, estimate or forecast. "Estimate" and "forecast" are written on the slide next to the number.
- **Source by word of mouth.** If the source is "as told", "not verified", the status is "estimate", and before the slide a question is asked whether there is confirmation.
- **No source.** The number does not go on a slide. A question is asked.
- **Placeholders.** "TBD", "to follow", "data later", "[screenshot]", a chart without numbers go neither on a slide nor into a proposal to the person. What is missing is listed as questions.
- **Charts** are built only from the table's numbers.

## Deck file format

`<project>/.claude/slides/<deck>.md`:

```markdown
# Slides: <deck>

## Settings
Audience and decision: <who, what they decide>
Use and format: <shown live, sent, edited by others; format>
Style source: <design system, template, past decks or direction N>
Tool: <…>

## Plan
| # | Claim | Job | Layout and reason |

## Sources
| Claim | Number | Source | Period | Units | Status |

## Confirmed
| Slide | Where | Screenshot | Date |

## Rejected: do not offer
<what> → "<the person's words>", <date>
```
