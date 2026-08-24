# How to write a lesson

Everything a lesson needs lives in **two** Markdown files, one per language, in
`src/content/lessons/ar/` and `src/content/lessons/en/`. No code change is ever
required to add, remove or reorder a lesson.

This page is the complete reference. If you read only two sections, read
[The golden rule](#the-golden-rule) and [The sources rules](#the-sources-rules).

---

## The golden rule

> **Never type a Qur'anic verse.** Reference it by number and let the build fill it in.

````markdown
```ayah
ref: 52:35
```
````

The verse text comes from `data/quran-uthmani.txt`, a checked-in copy of the Tanzil
Uthmani mushaf pinned by SHA-256. Typing a verse by hand risks a missing mark or a
wrong diacritic that nobody would notice in review, so the build refuses to let you.

If you genuinely need Qur'anic text inside a sentence, wrap it in Arabic guillemets
`«…»` and the build will check it against the mushaf **character by character,
including every haraka**. An untashkeeled quotation of a verse fails the build, on
purpose: either write the exact mushaf orthography (copy it from an `ayah` render),
or refer to the verse by name and number without quoting it.

`«…»` is therefore **reserved for the mushaf**. Quote hadith and everything else
with ordinary quotes: "…" in English, «…» is fine in Arabic *for non-Qur'anic
text* only because the checker ignores what it cannot find in the mushaf, but the
house style is to keep guillemets for the Qur'an and use “…” elsewhere, so a reader
learns that guillemets always mean revelation.

---

## One lesson, two files

```
src/content/lessons/ar/from-nothing.md   →   /lessons/from-nothing
src/content/lessons/en/from-nothing.md   →   /en/lessons/from-nothing
```

The file name becomes the URL. Use lowercase English with hyphens, naming the
lesson's idea (`from-nothing`, `who-created-god`).

**Every lesson is a pair.** The build fails if a slug exists in one language only,
because the header's language switch must never land on a 404. Write the English
lesson as its own piece of natural English prose (same argument, same blocks, same
order of sections), never a word-for-word translation.

### Frontmatter

The **Arabic file** is canonical for structure:

```yaml
---
title: أم خُلقوا من غير شيء؟
description: 'ثلاثة احتمالاتٍ لا رابع لها، وآيةٌ كادت تُطيّر قلب سامعها.'
unit: creator            # must match an id in src/content/units.json
order: 3                 # position in the whole curriculum, must be unique
minutes: 9               # rough reading time
emoji: 🌌
tags: [برهان الحدوث, سورة الطور]   # 2 to 4 short keywords
videos:                  # optional, embedded at the end
  - title: عنوان المقطع (اسم القناة)
    youtubeId: XXXXXXXXXXX
    start: 90            # optional, seconds
resources:               # optional, link cards at the end
  - title: اسم المرجع
    url: https://…
    note: سطرٌ واحدٌ يقول لماذا يستحقّ الفتح.
---
```

The **English file** carries only its own words: `title`, `description`, and
optionally `tags`, `videos`, `resources` (English-language ones). If it declares
`unit`, `order`, `minutes` or `emoji`, the build refuses: two declarations is two
places to disagree.

### ⚠️ Colons in Arabic text

YAML reads `:` as "key: value". An Arabic sentence containing a colon breaks the
parser, and in the browser that means a **blank page**. Wrap any value containing a
colon in single quotes. `npm run check` catches this and tells you which line.

---

## The body

Ordinary Markdown works: headings, bold, lists, tables, links, blockquotes.

Follow this shape, which every lesson uses:

1. **A `>` blockquote** at the very top with the one idea to remember.
2. **Sections** that build the argument, each with the verses and reports it rests on.
3. **A ` ```doubt ` block** wherever a real objection lives, stated at full strength.
4. **A ` ```rule ` box** near the end, stating the lesson's conclusion precisely.
5. **A ` ```quiz `** as the last thing in the file.

## The blocks

### `ayah`: one verse, displayed large

````markdown
```ayah
ref: 52:35
show: أم خلقوا من غير شيء          # optional: display only this part
highlight: من غير شيء              # optional: the words to point at (string or list)
note: سطرٌ واحدٌ يقول ما الذي ننظر إليه.
translation: '“Or were they created from nothing…?”'   # English files only
```
````

**Write `show`/`highlight` phrases without tashkeel**, the way you would in
ordinary Arabic. The build resolves them against the mushaf; if a phrase does not
resolve it prints the verse both with and without diacritics so you can copy the
exact form. Every phrase must occur **exactly once** in the verse; if not, write a
longer phrase.

**A displayed fragment must stand on its own without misleading.** Quoting part
of a verse is permitted — the Prophet ﷺ himself quoted parts of verses in his
letters ([IslamWeb 106526](https://www.islamweb.net/ar/fatwa/106526/),
[IslamQA 238948](https://islamqa.info/en/answers/238948)) — **provided the cut
does not distort the meaning**, the classic counter-example being «فويل
للمصلين» stopped before «الذين هم عن صلاتهم ساهون». So any phrase that is
*displayed on its own* (`show:` here, `word:` in a quiz) must be a complete,
non-misleading utterance: keep a condition with its consequence («وما كنا
معذبين **حتى نبعث رسولا**»), a verb with its object, an answer with its
question. The components add a muted «…» on whichever side the verse
continues, so never type dots into the phrase itself. `highlight:` is exempt:
it only colours words inside a fully displayed verse.

Two spelling traps the resolver cannot absorb: a phrase mixing the two kinds of
alef-madda (one word like «آياتنا», hamza+alef in the mushaf, next to one like
«الآفاق», alef+madda-sign) will never match as one phrase, so split it; and «حتى» is
written with a dagger alef, so keep it out of anchor phrases.

`translation` appears under the verse labeled **Meaning:**; it is *your
explanatory rendering*, in quotation marks, not a canonical translation; the card
already links quran.com for those. Use it in every English lesson's ayah blocks and
never in Arabic ones.

### `hadith`: a report from the Prophet ﷺ

````markdown
```hadith
text: 'ما مِن مولودٍ إلّا يُولَد على الفطرة…'
source: 'صحيح البخاري (١٣٥٩)، ومسلم (٢٦٥٨)'     # English file: 'Sahih al-Bukhari 1359'
url: 'https://sunnah.com/bukhari:1359'
translation: '“No child is born except upon the fitrah…”'   # English files only
note: سطرُ سياقٍ اختياريّ.
```
````

`text` is the Arabic matn, quoted **exactly** from its collection; verify it
against sunnah.com (or the hadith-api dataset mirroring it) before committing, and
keep the الله/ﷺ honorifics as the source has them. See
[the sources rules](#the-sources-rules) for what may be cited at all.

### `doubt`: an objection and its answer

The signature block of this site.

````markdown
```doubt
claim: الشبهة بصيغة أصحابها الأقوياء، لا بصيغةٍ مضعَّفة.
answer: |-
  الجواب في فقرةٍ أو فقرتين.
  السطر الثاني يبقى سطرًا ثانيًا في العرض.
```
````

Rules for `claim`: it must be the **strongest** wording of the objection, the one
its holders actually use. If a reader who believes the objection reads your `claim`
and thinks "that's not what we say", the block has failed before the answer starts.

### `compare`: two or three positions side by side

````markdown
```compare
columns:
  - title: عالَمٌ بلا خالق
    points:
      - نقطةٌ قصيرة
      - نقطةٌ أخرى
  - title: عالَمٌ له خالق
    points:
      - …
```
````

### `quiz`: questions

````markdown
```quiz
title: اختبِر نفسك          # optional
questions:
  - q: نصّ السؤال؟
    ref: 52:35              # optional: shows the Qur'anic phrase above the question
    word: أم خلقوا
    options:
      - الإجابة الصحيحة أوّلًا
      - خيارٌ معقول
      - خيارٌ معقول
      - خيارٌ معقول
    answer: 0               # index into `options`, so 0 is the FIRST one
    why: التعليل في جملةٍ واحدة، يظهر بعد الإجابة صوابًا كانت أو خطأ.
```
````

- Put the **correct answer first** and use `answer: 0`; it keeps review easy. The
  options are shuffled at render time, seeded from the question's id, so readers
  never learn that the first option is always right.
- `why` is required. It is shown after answering, right or wrong.
- Four options is the house style. Distractors should be plausible; a caricature
  distractor teaches the reader that the site fights caricatures.
- Every question automatically joins the mixed bank on `/practice`, per language.
  Write them so they still make sense out of context.

### `rule`, `tip`, `note`, `warning`: callout boxes

These four take **Markdown**, not YAML, so lists and bold work inside them.

| Box | Heading (ar / en) | Use it for |
| --- | --- | --- |
| `rule` | خلاصة القول / The point | the lesson's conclusion, stated precisely |
| `tip` | تأمَّل / Reflect | something worth pausing on |
| `note` | انتبِه / Note | a side detail, or a point of scholarly difference |
| `warning` | تنبيهٌ مهمّ / Important | a common trap, or a limit of the argument |

---

## The sources rules

These are the rules that make the site defensible. Breaking one is a defect even
when nobody notices.

1. **Hadith: sahih or absent.** Bukhari and Muslim need no grading; anything else
   carries a mainstream authentication (with who graded it), linked. No weak
   narration appears on this site however beloved: «كنت كنزًا مخفيًّا» and its
   cousins are out. Verify the exact matn against the collection before committing.
2. **No weak scientific-miracle claims.** A scientific fact may illustrate; the
   argument never rests on a strained scientific reading of a verse. When in
   doubt, leave it out; one refuted claim costs the site every strong argument
   beside it.
3. **Contested points are named as contested.** Where qualified scholarship
   genuinely differs (evolution and Adam's creation; dating details of the Rome
   prophecy; attributions of famous reports), say who holds what and link the
   source. Flattening a real disagreement into one answer is a defect even if the
   answer picked is the majority one.
4. **Tafsir claims cite tafsir.** "This verse means X" needs al-Tabari, Ibn
   Kathir, al-Saʿdi or al-Muyassar behind it; link islamweb's library, quran.com's
   tafsir view, or shamela.
5. **Respect while disagreeing.** Show the position fails; never mock the person.
   The preservation argument cites the other scriptures' own textual scholars, not
   polemics. No dunking, no triumphalism; the reader this site exists for is
   watching how we treat their side.
6. **Videos: verify before embedding.** Confirm the id and the title, and prefer a
   scholar's own channel over TV re-uploads:
   `node -e "fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json').then(r=>r.json()).then(console.log)"`
7. **Nothing haram**: no music beds, no images of people, no channels mixing
   teaching with entertainment.

## Writing style

- **Arabic: easy MSA (فصحى ميسّرة).** Short sentences. Vowel the words that would
  otherwise be ambiguous, not every word. Explain a term the first time it appears
  (then the glossary carries it).
- **English: natural, plain English.** Write the argument fresh; never translate
  the Arabic sentence structure.
- **Argue in order.** A lesson may rely on anything an *earlier* lesson
  established, and nothing from a later one. Unit 1–3 lessons argue from reason
  and observation; the Qur'an speaks there as a text making an argument, not yet
  as an authority.
- **The reader is respected, always.** The site's tone is fixed by 16:125: wisdom,
  good counsel, and arguing in the best manner. If a sentence would feel like a
  sneer to an atheist reader, rewrite it.

---

## Before you commit

```bash
npm run check
```

That runs the Qur'an verifier, the bilingual pair checks, the linter and the
type-checker. The Qur'an verifier speaks Arabic and points at the exact line;
the pair checker (build-lesson-index) speaks English. Common messages:

| Message | What to do |
| --- | --- |
| `لم يُعثر على «…» في الآية` | Copy the phrase from the "بلا تشكيل" line it prints |
| `العبارة «…» تتكرّر N مرّاتٍ` | Write a longer phrase that pins down the place |
| `فيه خطأٌ في صيغة YAML` | Usually a colon in Arabic text; wrap the value in `'…'` |
| `هذه العبارة قرآنيّة لكنها لا تطابق المصحف` | Use an `ayah` block, or copy the exact mushaf orthography |
| `exists in ar/ but not in en/` | Write the missing half of the pair |
| `order N is already used by …` | Two lessons share an `order`; renumber one |
| `en/… declares «unit»` | Structure lives in the Arabic file; delete the field from the English one |
