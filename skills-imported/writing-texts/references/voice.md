# The person's and the product's voice

The general rules in `SKILL.md` are the same for everyone. The character of a specific person and the voice of a specific product live in two files outside the skill. The skill reads them and adds to them only with the person's consent.

## Layers

| Layer | File | Contents |
|---|---|---|
| Person's voice | `~/.agents/voice.md` | how this person writes, in all their projects |
| Product's voice | `<project>/.claude/voice.md` | form of address, terms, buttons and messages of the product |
| General rules | `SKILL.md` | the same for everyone |

Which layer wins depends on the text:

- **interface text and product docs:** product, then person, then general rules;
- **authored text** (post, note, article, letter, message on the person's behalf): person, then product, then general rules.

No file: the layer is skipped. `~` here means the user's home folder, in any agent.

The files are written in the person's language; section names may be in that language too. Match sections by meaning, not by exact heading.

## Start of a task

Before the first text in a task, read both files if they exist. Use the words from "My words" and "Terms" instead of the synonyms that would come on their own: if the person's voice says "I use: созвон", their note says «созвон» even when the request says «встреча».

When a helper agent writes text, pass it the paths to both files in its brief. It reads them itself.

## When the text is the task

The invitation to send texts and the record proposal appear only when the person asks for the text itself: to write, rewrite or check it. If the skill runs as a rule inside other work (code, design, setup, answering a question), the voice files are read and applied, but the reply has neither the invitation nor the proposal.

## No personal file

In the first task with text where `~/.agents/voice.md` does not exist, add one line to the reply, in the person's language:

> If you send me 2–3 of your texts, I'll write down how you write and will write closer to you from then on.
>
> Если пришлёшь 2–3 своих текста, я выпишу, как ты пишешь, и дальше буду писать ближе к тебе.

They sent texts: draft the file in the format below from what the texts show, and show it whole. Record only the items the person confirmed.

They declined or said nothing: work by the general rules. Do not add the line again in this task.

## End of a task: the record proposal

If in the task the person corrected your text or rejected a wording, the task's last message ends with a record proposal. It consists of:

1. the line "Record in the voice?" (in the person's language);
2. one to three records, each as: layer (personal or product), section, record text with the date;
3. for a record that contradicts one already written: the date and a quote of the old record and the question "Replace?";
4. the line "Reply 'yes', 'no', or which ones to record".

Until the person answers, the voice files do not change. After "yes", write exactly what was proposed into the named section; if a replacement was agreed, delete the old record. Partial consent: only the named records.

A correction goes into the proposal when it will outlive this text and apply to another text on the same subject: how the person names things, what tone they take, which words they dislike. A correction that depends on this text (not enough space, a different length, a one-off fact) does not. If all corrections in the task are like that, there is no proposal.

## Consolidation

For a section with more than 15 records, propose consolidating: similar records become one rule with one or two examples. Show before and after; write after "yes".

## Personal file format

```markdown
# Voice: <name or handle>

## How I write
<rule>. "<before>" → "<after>". <YYYY-MM-DD>

## My words
I use: <words>
I don't use: <word> (instead: <word>)

## Rejected: do not offer
<what the agent offered> → "<the person's words>", <YYYY-MM-DD>

## Samples
> <a short piece of the person's text>
```

An invented example:

```markdown
# Голос: Анна

## Как я пишу
Говорю от себя, а не безлично. «Проводится анализ обращений» → «Я разбираю обращения». 2026-04-02
Цифры вместо оценок. «Стало заметно быстрее» → «Ответ приходит за 2 часа вместо дня». 2026-04-10

## Мои слова
Пользуюсь: созвон, бэклог, «поехали дальше»
Не пользуюсь: митинг (вместо: созвон), кейс в значении «случай»

## Отклонено: не предлагать
Вступление «В современном мире продуктовой разработки» → «никогда так не начинаю», 2026-04-02

## Образцы
> Три недели мы спорили о кнопке. Выиграла та, которую никто не предлагал.
```

## Product file format

```markdown
# Product voice: <product>

## Audience and tone
Form of address (formal / informal), tone, what never happens.

## Terms
<canonical name>, not "<synonym>"

## Buttons and messages
<rule>

## Rejected: do not offer
<what> → "<words>", <YYYY-MM-DD>
```

An invented example:

```markdown
# Product voice: Ledger

## Audience and tone
Formal address. Calm, no exclamation marks, no jokes in errors.

## Terms
account, not "profile"
transfer, not "transaction"

## Buttons and messages
A button names the action with a verb: "Save", "Delete account".
An error says what happened and what to do: "The transfer failed. Check the card number."

## Rejected: do not offer
"Oops! Something went wrong" → "we don't apologize with smileys", 2026-05-20
```
