---
name: writing-texts
description: Write, rewrite, or review Russian and English prose so it reads as written by a person, not a model. Use for requests to make text more human, simplify language, remove formulaic writing, or edit articles, notes, docs, UI copy, presentations, and Figma text. Covers drafting and language review without a separate editing skill. Also use when the user corrects the agent's wording, says how they write or how their product speaks, or asks to remember a writing preference.
---
> Adapted for Muse from [schudarin/chudarin-design-skills](https://github.com/schudarin/chudarin-design-skills) (MIT) — plain-markdown portable unit. Claude Code-isms neutralized; any Figma MCP / write steps are kept as read-only reference knowledge.


# Writing texts

A common layer that holds for any text, in Russian and in English. The place sets the register: a blog post is warm and in the first person; interface text is short and neutral. The rules below apply in both.

To the user, write as to a colleague who knows the subject but has not followed the work. In project docs, follow their register; by default it is neutral. In authored text, keep the author's own position. No separate skill is needed to check clarity and formulaic phrasing.

## Files

| File | When to read |
|---|---|
| [references/voice.md](references/voice.md) | before the first text in a task; how the voice files work and when to propose a record |
| [references/articles.md](references/articles.md) | writing or reworking an article, a guide, a title, a summary or a translation |
| [references/editing-patterns.md](references/editing-patterns.md) | a detailed pass for formulaic phrasing, RU and EN examples |

## The person's and the product's voice

Before any text, read `~/workspace/skills/writing-texts/voice.md` (your personal voice, if you keep one there) and `<project>/.claude/voice.md` (the product's voice), if they exist. Interface text and product docs follow the product's voice; authored text follows the person's voice; both override the general rules below.

## The thing, not the category

Name the thing, not its class.

- "Grew from 4 to 19 seconds", not "slowed down significantly". «Выросло с 4 до 19 секунд», а не «значительно замедлилось».
- "A 2011 ThinkPad with 4 GB of RAM", not "an old computer" (an invented example).

Do not invent specifics. If a thought cannot be finished without a missing fact, ask the author. Do not put `TBD` into a finished edit: use what is already known.

## Conversational tone in authored text

Write the way the author would explain the thought to a colleague they know: plain words, from themselves, with a clear line of thought. This guides the language; smooth sentences do not mean the article is complete. Interfaces and technical docs keep their own register.

Replace heavy words with ordinary ones and abstract phrasing with words about who does or feels what. Merge a repeated thought into one clear sentence. Keep the author's personal examples, vocabulary and intonation. Do not stop at fixing commas if the sentence itself sounds unnatural.

- «Осуществляется процесс согласования макетов с заинтересованными сторонами» → «Я показываю макеты команде и собираю правки».
- «Возникает ощущение некоторой перегруженности» → «Через неделю понимаешь, что не успеваешь».
- "Stakeholder alignment on mockups is being conducted" → "I show the mockups to the team and collect edits".

Check that the sentence is easy to say out loud. Do not add filler words, forced slang or chopped sentences to sound conversational. The meaning and the author's degree of certainty matter more than copying an example word for word.

## Irony

The author's irony keeps a text alive; without it, editing turns an article into a smooth manual. Keep it when editing, do not straighten it into a neutral statement: "a meeting that could have been an email" does not become "the meeting was inefficient".

In new text, light irony fits when the material gives a reason: a gap between a promise and the result, between a name and what actually happens. Match the author's tone and set no quota: if irony reads as a device, there is too much. Irony grows from the material's facts; without a reason, do not add it.

## Personal text: keep the line of thought

"More human" does not mean "shorter". Keep the specific situation, causes, consequences and the author's reaction. Remove verbal repetition, but not the explanation of why the situation arose and what it did to the person. The author's colloquial and professional vocabulary fits if the reader understands it.

The author's experience, feelings and sharp judgements stay theirs. Do not add motives to other people, and do not soften what the author wrote to "it seemed to me" without being asked. Suggest fixing a conclusion that does not follow from the examples as a separate proposal; the decision on meaning stays with the author.

## Mode and scope

Choose the mode by the request; if `mode:author`, `mode:edit` or `mode:detect` is given, follow it.

- **Write (`author`).** Create the text from the material provided, following the voice and clarity rules. If the skill runs as a rule inside another task, apply it without a separate report on the skill's work.
- **Rewrite (`edit`).** Work on the author's latest version, including their manual edits. Edit right away within the allowed scope; leave clear passages alone. Return the text and, if useful, name the changes briefly.
- **Review (`detect`).** When asked to check or to suggest first, give the exact place, the problem and a fix. Separate language errors from meaning suggestions and matters of taste. Do not rewrite the whole text and do not pad the notes to a fixed number.

After the author chooses, apply what was agreed; do not bring back a rejected edit in other words. Change a file only when asked to change the file; otherwise return the text in the reply.

"Put it all together" means assembling the current fragments with the accepted replacements and reorderings. Do not start another unrequested edit and do not return an old version of a neighboring paragraph. Ask separately about any ambiguity that blocks the assembly.

## What to keep when editing

Facts, numbers, names, sources, caveats, causal links and the degree of certainty stay unless the author asked for or agreed to a change. Keep paths, commands, identifiers and technical thresholds exact. Do not change code, quotes, frontmatter or link targets without a request to work on them.

Simplify jargon when it gets in the reader's way; keep precise terms and explain them if needed. Do not invent experience, numbers or sources to be convincing. A sample request in a tutorial is fine if it is clearly presented as an example and relies on confirmed capabilities; do not pass it off as the author's real session. Do not judge from the text's features whether a person or a model wrote it.

## The first sentence carries the point

Start with a specific thought, observation or question on the subject. An article can name the problem first and reach the answer through examples; the final conclusion does not have to be the first sentence. Remove general warm-up and topic announcements with no content. In an instruction or an error message, give the needed action or fact at once.

## Formulaic phrases

Rewrite these unless they are a precise term or the author's deliberate choice:

- RU: «в современном мире», «в наши дни», «не секрет, что», «как известно»; EN: "in today's world", "it's no secret that", "as we all know"
- RU: «в этой статье мы рассмотрим», «давайте разберёмся», «поехали»; EN: "in this article we will explore", "let's dive in"
- RU: «важно отметить», «стоит отметить», «следует учитывать», «таким образом», «подводя итог»; EN: "it's worth noting", "it's important to note", "in conclusion"
- RU: «является», «осуществлять», «в рамках», «данный» вместо «этот»; EN: "utilize", "facilitate", "serves as"
- RU: «эффективный», «инновационный», «уникальный», «мощный инструмент», «гибкий и масштабируемый»; EN: "innovative", "seamless", "powerful yet simple"
- RU: «позволяет» without who is allowed to do what; EN: "enables" in the same way

## Dashes

In new text, prefer a period, comma, colon or parentheses over the long dash (—). In a targeted edit, do not remove dashes the author kept or added. A punctuation mark alone says nothing about where a text came from.

The short dash (–) in ranges is fine: «8–10 тысяч», "11–15 September".

## Every verb has an actor

«Это позволяет ускорить процессы» / "This helps speed up processes": who makes what faster, and by how much.

The passive stays only when the actor is truly unknown or unimportant.

## Rhythm

Connected paragraphs with sentences of different lengths. Split a sentence when it is hard to understand on first reading. Do not turn an explanation into a string of short slogans and do not fit sentences to a "long one, then a short punch" pattern.

When shortening, first remove explanations and conclusions that repeat each other, and merge close sections that share one job. Keep the links between thoughts, the main capabilities and the differences between ways of working. A short sentence does not make a text clearer by itself. After shortening, reread the neighboring paragraphs as one continuous explanation: if it reads like notes, restore the links and the natural flow. Swapping periods for commas or adding «ну», «вот», "well", "so" does not bring the conversational tone back. Short commands and step lists do not need to be stretched.

## What not to add

- Jokes invented for a conversational tone. A joke that is not in the material sounds foreign.
- Emoji inside the text.
- Opinions, judgements or memories the author did not express.
- Claims about an industry without a number or a specific case.

## Clarity and pattern check

Keep these questions in mind when writing, and check the result against them when editing:

1. **What exactly is said?** In a product description, replace general praise with an action or a property. In a personal text, keep the feelings and their link to events.
2. **Is there content?** A sentence that fits any project may be empty. But a transition, a personal reaction or a conclusion from the examples is not redundant just because it is general.
3. **Who acts?** Restore the actor from the source if the sentence is unclear without one; do not guess an unknown participant.
4. **Clear on first reading and natural?** Split a tangled sentence or simplify the words. Leave a clear long sentence. After shortening, check that neighboring paragraphs connect, per "Rhythm".
5. **Does a device help, or repeat mechanically?** One device alone is fine. A combination of several patterns, or one repeated constantly, needs a check by meaning, not automatic removal.
6. **Is the main idea in place?** The reader does not have to dig through an introduction and meta-commentary to reach the point.
7. **Is there enough context?** The reader understands the thought without access to someone else's notes or code. For an article, see `references/articles.md`.

For a detailed pass on formulaic phrasing, read `references/editing-patterns.md`. Apply it with the genre and the author's intonation in mind. Do not add a report on internal checks or on which catalogue was used to the result.
