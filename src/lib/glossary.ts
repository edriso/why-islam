import type { Localized } from './i18n'

/**
 * Words a newcomer meets in the lessons, defined in a line or two per language.
 * Only put a term here once a lesson actually uses it; the glossary is a
 * companion to the reading, not an encyclopedia.
 */

export interface Term {
  term: Localized
  definition: Localized
  /** Slug of the lesson where the term is explained in full. */
  lesson?: string
}

export const TERMS: readonly Term[] = [
  {
    term: { ar: 'العقيدة', en: 'ʿAqidah (creed)' },
    definition: {
      ar: 'ما يعقد الإنسان قلبه عليه من إيمان: بالله وملائكته وكتبه ورسله واليوم الآخر والقدر. وهي موضوع هذا الدليل كلّه.',
      en: 'What the heart is bound to in belief: in Allah, His angels, His books, His messengers, the Last Day, and the decree. It is the subject of this whole guide.',
    },
    lesson: 'big-questions',
  },
  {
    term: { ar: 'الفطرة', en: 'Fitrah' },
    definition: {
      ar: 'الاستعداد الأصليّ الذي خُلق عليه الإنسان: معرفة الخالق والميل إليه قبل أيّ تعليم. تظهر عند الشدّة حين تسقط الأقنعة.',
      en: 'The original disposition every human is born on: a recognition of the Creator and a pull toward Him that precedes all teaching. It surfaces in crisis, when the masks drop.',
    },
    lesson: 'fitrah',
  },
  {
    term: { ar: 'التوحيد', en: 'Tawhid' },
    definition: {
      ar: 'إفراد الله وحده بالخلق والتدبير والعبادة، وبأسمائه وصفاته. وهو الرسالة الواحدة التي جاء بها الأنبياء جميعًا.',
      en: 'Affirming Allah alone as Creator, Sustainer and the only one worthy of worship, with His names and attributes. The one message every prophet carried.',
    },
    lesson: 'one-god',
  },
  {
    term: { ar: 'الشرك', en: 'Shirk' },
    definition: {
      ar: 'صرف شيءٍ من العبادة لغير الله، أو جعل ندٍّ له في خصائصه. وهو نقيض التوحيد، وأشدّ ما حذّرت منه الرسالات.',
      en: 'Directing any worship to other than Allah, or setting up a rival to Him in what is His alone. The opposite of tawhid, and the gravest thing every revelation warned against.',
    },
  },
  {
    term: { ar: 'الوحي', en: 'Wahy (revelation)' },
    definition: {
      ar: 'إعلام الله لرسله بما يريد إبلاغه للناس، بواسطة المَلَك جبريل عليه السلام أو بغير ذلك ممّا صحّ به الخبر.',
      en: 'Allah’s communication to His messengers of what He wills to reach people, through the angel Jibril (Gabriel) or the other channels the sources report.',
    },
    lesson: 'why-revelation',
  },
  {
    term: { ar: 'النبيّ والرسول', en: 'Prophet and Messenger' },
    definition: {
      ar: 'النبيّ من أوحى الله إليه، والرسول من أُمر مع ذلك بالبلاغ إلى قومٍ أو إلى الناس كافّة. وكلّ رسولٍ نبيّ ولا عكس، على المشهور.',
      en: 'A prophet (nabi) receives revelation; a messenger (rasul) is additionally charged with delivering it to a people. Every messenger is a prophet, not the reverse, on the better-known account.',
    },
    lesson: 'one-message',
  },
  {
    term: { ar: 'الشبهة', en: 'Shubhah (objection)' },
    definition: {
      ar: 'اعتراضٌ يُلبِس الحقّ بالباطل حتى يشتبها. لا تُدفع بالتجاهل ولا بالغضب، بل بعرضها في أقوى صورها ثم بيان موضع الخلل فيها.',
      en: 'An objection that dresses falsehood in the clothes of truth until the two blur. It is answered neither by ignoring it nor by anger, but by stating it at full strength and then showing exactly where it fails.',
    },
    lesson: 'keep-asking',
  },
  {
    term: { ar: 'الآية', en: 'Ayah' },
    definition: {
      ar: 'في القرآن بمعنيين متلازمين: المقطع المرقَّم من السورة، والعلامة الدالّة على الله في الكون والنفس. والقرآن يستعمل الكلمة نفسها للاثنين عمدًا: كلاهما يشير إلى صاحبه.',
      en: 'In the Qur’an, two interlocked meanings: a numbered verse of a surah, and a sign pointing to Allah, in the cosmos and in ourselves. The Qur’an uses one word for both on purpose: each points to its Author.',
    },
    lesson: 'design',
  },
  {
    term: { ar: 'التفسير', en: 'Tafsir' },
    definition: {
      ar: 'علم بيان معاني القرآن بأدواته المنضبطة: القرآن يفسّر بعضه بعضًا، ثم السنّة، ثم فهم الصحابة واللغة. أشهر كتبه المعتمدة هنا: الطبريّ وابن كثير والسعديّ.',
      en: 'The discipline of explaining the Qur’an by its established tools: the Qur’an explaining itself, then the Sunnah, then the first generation’s understanding and the language. The commentaries relied on here: al-Tabari, Ibn Kathir, al-Saʿdi.',
    },
  },
  {
    term: { ar: 'السيرة', en: 'Sirah' },
    definition: {
      ar: 'أخبار حياة النبيّ ﷺ المجموعة في كتبٍ كسيرة ابن هشام. أسانيدها أخفّ تحرّيًا من أسانيد الصحيحين، ولذلك يميّز هذا الدليل دائمًا بين «رواه البخاري» و«ذكره أهل السِّيَر».',
      en: 'The accounts of the Prophet’s ﷺ life gathered in books like Ibn Hisham’s. Their chains are held to a lighter standard than the Sahih collections’, which is why this guide always distinguishes “narrated by al-Bukhari” from “related in the sirah books.”',
    },
    lesson: 'before-prophethood',
  },
  {
    term: { ar: 'الحديث', en: 'Hadith' },
    definition: {
      ar: 'ما نُقل عن النبيّ ﷺ من قولٍ أو فعلٍ أو إقرار، بأسانيدَ تُفحص رجالُها فحصًا دقيقًا. أصحّ دواوينه صحيحا البخاريّ ومسلم.',
      en: 'A report of what the Prophet ﷺ said, did or approved, carried by chains of narrators examined man by man. The soundest collections are Sahih al-Bukhari and Sahih Muslim.',
    },
  },
  {
    term: { ar: 'السنّة', en: 'Sunnah' },
    definition: {
      ar: 'طريقة النبيّ ﷺ وهديه، المنقولة إلينا بالأحاديث. وهي البيان العمليّ للقرآن.',
      en: 'The Prophet’s ﷺ way and practice, transmitted to us in the hadith. It is the Qur’an’s lived explanation.',
    },
  },
  {
    term: { ar: 'التواتر', en: 'Tawatur (mass transmission)' },
    definition: {
      ar: 'نقل جمعٍ يستحيل تواطؤهم على الكذب عن جمعٍ مثلهم، جيلًا عن جيل. وبه وصلنا القرآن: حفظًا وكتابةً معًا.',
      en: 'Transmission by numbers so large, in every generation, that collusion on a lie is impossible. This is how the Qur’an reached us: memorized and written, together.',
    },
    lesson: 'preserved',
  },
  {
    term: { ar: 'الإعجاز', en: 'Iʿjaz (inimitability)' },
    definition: {
      ar: 'عجز الخلق عن الإتيان بمثل القرآن مع قيام التحدّي ودوامه. أظهر وجوهه بلاغته ونظمه، وثباتُ التحدّي أربعة عشر قرنًا.',
      en: 'The demonstrated inability of anyone to produce the like of the Qur’an while its open challenge stands. Its clearest face is the language itself, and fourteen unanswered centuries.',
    },
    lesson: 'the-challenge',
  },
  {
    term: { ar: 'الشهادتان', en: 'The Shahadah' },
    definition: {
      ar: 'قول: أشهد أن لا إله إلا الله وأشهد أنّ محمّدًا رسول الله، بيقين القلب. بها يدخل الإنسان في الإسلام، بلا وسيطٍ ولا مراسم.',
      en: 'The testimony, “I bear witness that there is no god but Allah, and that Muhammad is the Messenger of Allah”, said with conviction. It is the whole entry into Islam: no intermediary, no ceremony.',
    },
    lesson: 'becoming-muslim',
  },
]
