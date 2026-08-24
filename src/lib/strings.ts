import type { Lang } from './i18n'

/**
 * Every interface string on the site, in both languages.
 *
 * Lesson content lives in Markdown and is written per language; this file is
 * only the chrome around it: navigation, buttons, labels, announcements. If a
 * string appears in a component, it comes from here, so adding a language is
 * filling in one more object rather than hunting through the tree.
 *
 * Grammar lives here too. Arabic counts need the dual and the 3–10 plural, and
 * English needs neither, so counts are methods rather than templates: the
 * component asks for «٣ دروس» / “3 lessons” and never concatenates it.
 */

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

function arabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)])
}

/** «٣ دروس» / «درسان» / «درس»: the four Arabic count forms. */
function arCount(n: number, [one, two, few, many]: [string, string, string, string]) {
  if (n === 1) return one
  if (n === 2) return two
  if (n >= 3 && n <= 10) return `${arabicDigits(n)} ${few}`
  return `${arabicDigits(n)} ${many}`
}

export interface Strings {
  /** ١٢ on Arabic pages, 12 on English ones. */
  digits: (value: number | string) => string

  site: {
    name: string
    /** The default tab title's second half, after the site name. */
    tagline: string
  }

  a11y: {
    skipToContent: string
    mainNav: string
    openMenu: string
    closeMenu: string
    opensNewTab: string
    /** Label of the language switch; written in the *target* language. */
    switchLanguage: string
  }

  nav: {
    lessons: string
    practice: string
    cheatsheet: string
    glossary: string
    about: string
  }

  theme: { toLight: string; toDark: string }
  backToTop: string

  home: {
    kicker: string
    title: string
    titleAccent: string
    intro: string
    ctaStart: string
    ctaContinue: string
    ctaRestart: string
    ctaCheatsheet: string
    stats: (lessons: number, units: number) => string
    howToUseTitle: string
    howToUse: { title: string; body: string }[]
    curriculumTitle: string
    curriculumIntro: string
    jumpToUnit: string
    unitN: (n: number) => string
    lessonN: (n: number) => string
    doneSr: string
  }

  lesson: {
    allLessons: string
    minutesRead: (n: number) => string
    watch: string
    goDeeper: string
    markDone: string
    markedDone: string
    savedLocally: string
    prevLesson: string
    nextLesson: string
    lessonNav: string
    /** The three live-region announcements, one per tier. */
    announceDone: (completed: number, total: number) => string
    announceUnitDone: (unit: string) => string
    announceGuideDone: string
    unitDoneLine: (unit: string) => string
  }

  progress: {
    yourProgress: string
    ofLessons: (completed: number, total: number) => string
    barLabel: string
  }

  completion: {
    title: string
    body: (lessons: number, units: number) => string
    nextStep: string
    review: string
    cheatsheet: string
    allLessons: string
  }

  ayah: {
    surah: string
    verse: string
    partOfIt: string
    openInContext: string
    listenTo: (reciter: string) => string
    audioError: string
    audioLoading: string
    audioPlaying: string
    statusLoading: string
    nowPlaying: string
    /** Heading of the explanatory rendering under a verse on English pages. */
    meaning: string
    staleData: string
  }

  hadith: {
    label: string
    source: string
  }

  doubt: {
    claim: string
    answer: string
  }

  callouts: {
    rule: string
    tip: string
    note: string
    warning: string
  }

  quiz: {
    defaultTitle: string
    correct: string
    correctIs: (answer: string) => string
    srCorrectAnswer: string
    srPickedWrong: string
    verdictPerfect: string
    verdictRetry: string
    retry: string
  }

  practice: {
    title: string
    intro: (roundSize: number) => string
    bankSize: (n: number) => string
    newRound: string
    roundStatus: (round: number, size: number) => string
    roundTitle: string
    noQuestions: string
    missedOne: string
    missedOneLink: string
    missedOneTail: string
  }

  glossary: {
    title: string
    intro: string
    searchPlaceholder: string
    searchLabel: string
    countStatus: (shown: number, total: number) => string
    noMatch: string
    readLesson: string
  }

  settings: {
    label: string
    reciterLegend: string
    transferTitle: string
    transferIntroEmpty: string
    transferIntro: (completed: number, total: number) => string
    exportButton: string
    importButton: string
    clearButton: string
    confirmClear: string
    cancelClear: string
    exported: string
    cleared: string
    notAProgressFile: string
    nothingRecognised: string
    imported: (saved: number, total: number) => string
    unreadableFile: string
  }

  notFound: {
    title: string
    body: string
    backHome: string
  }

  routeError: {
    reloading: string
    reloadingTitle: string
    title: string
    staleBody: string
    genericBody: string
    progressSafe: string
    reload: string
    backHome: string
  }

  footer: {
    line: string
    aboutSources: string
    contribute: string
    verseCaption: (surahName: string, ayah: number) => string
  }
}

const ar: Strings = {
  digits: arabicDigits,

  site: {
    name: 'لماذا الإسلام؟',
    tagline: 'دليلٌ هادئ من السؤال إلى اليقين',
  },

  a11y: {
    skipToContent: 'تخطَّ إلى المحتوى',
    mainNav: 'التنقّل الرئيسيّ',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    opensNewTab: ' (يفتح في صفحةٍ جديدة)',
    switchLanguage: 'Read this page in English',
  },

  nav: {
    lessons: 'الدروس',
    practice: 'راجِع',
    cheatsheet: 'الخلاصة',
    glossary: 'المعجم',
    about: 'عن الدليل',
  },

  theme: {
    toLight: 'التبديل إلى المظهر الفاتح',
    toDark: 'التبديل إلى المظهر الداكن',
  },
  backToTop: 'لأعلى',

  home: {
    kicker: 'بالعقل أوّلًا، ثم بالنقل الصحيح',
    title: 'لماذا الإسلام؟',
    titleAccent: 'من السؤال إلى اليقين',
    intro:
      'هل للكون خالق؟ ولماذا لا نراه؟ ولماذا الشرّ والألم؟ وما الدليل على أنّ محمّدًا ﷺ لم يخترع هذا الدين اختراعًا؟ هذا الدليل لا يستنكر أسئلتك، بل يأخذها على محمل الجدّ: ثلاثون درسًا تمشي بك من السؤال إلى الجواب خطوةً خطوة.',
    ctaStart: 'ابدأ الدرس الأوّل',
    ctaContinue: 'تابِع من حيث توقّفت',
    ctaRestart: 'أعِد القراءة من الدرس الأوّل',
    ctaCheatsheet: 'اذهب إلى الخلاصة',
    stats: (lessons, units) =>
      `${arCount(lessons, ['درسٌ واحد', 'درسان', 'دروس', 'درسًا'])} في ${arCount(units, ['وحدةٍ واحدة', 'وحدتين', 'وحدات', 'وحدة'])} · مجّانيّ بالكامل · بلا حسابٍ ولا إعلانات`,
    howToUseTitle: 'كيف تقرأ هذا الدليل',
    howToUse: [
      {
        title: 'اقرأ بإنصاف',
        body: 'كلّ درسٍ يعالج سؤالًا واحدًا، بلغةٍ بسيطة، ويبدأ من العقل والمشاهدة قبل أن يستشهد بشيء.',
      },
      {
        title: 'قِف عند الآيات',
        body: 'اسمع الآية بصوت قارئٍ متقن، وافتحها في سياقها. النصّ القرآنيّ هنا منسوخٌ من المصحف حرفًا حرفًا، لا مكتوبٌ باليد.',
      },
      {
        title: 'اختبِر فهمك',
        body: 'في آخر كلّ درسٍ أسئلةٌ قصيرة تكشف لك ما رسخ وما يحتاج إلى قراءةٍ ثانية.',
      },
    ],
    curriculumTitle: 'المنهج',
    curriculumIntro:
      'ترتيب الوحدات مقصود: كلّ وحدةٍ تبني على ما أثبتته التي قبلها، فلا يُطلب منك تسليمٌ بشيءٍ لم يقُم دليله بعد. اقرأها بالترتيب في أوّل مرّة، ثمّ عُد إلى ما تحتاجه متى شئت.',
    jumpToUnit: 'الانتقال إلى وحدة',
    unitN: (n) => `الوحدة ${arabicDigits(n)}: `,
    lessonN: (n) => `الدرس ${arabicDigits(n)}: `,
    doneSr: ' (أتممتَه)',
  },

  lesson: {
    allLessons: 'كلّ الدروس',
    minutesRead: (n) => `نحو ${arCount(n, ['دقيقةً واحدة', 'دقيقتين', 'دقائق', 'دقيقة'])} للقراءة`,
    watch: 'شاهِد',
    goDeeper: 'للاستزادة',
    markDone: 'وسم الدرس كمُنجَز',
    markedDone: 'أتممتَ هذا الدرس',
    savedLocally: 'يُحفَظ تقدُّمك على جهازك وحده، بلا حسابٍ ولا خادم.',
    prevLesson: 'الدرس السابق',
    nextLesson: 'الدرس التالي',
    lessonNav: 'التنقّل بين الدروس',
    announceDone: (completed, total) =>
      `تمّ وسم الدرس كمُنجَز. أتممتَ ${arCount(completed, ['درسًا واحدًا', 'درسين', 'دروس', 'درسًا'])} من ${arabicDigits(total)}.`,
    announceUnitDone: (unit) => `تمّ وسم الدرس كمُنجَز، وبه أتممتَ وحدة ${unit} كاملة.`,
    announceGuideDone: 'تمّ وسم الدرس كمُنجَز، وبه أتممتَ دروس الدليل كلَّها.',
    unitDoneLine: (unit) => `وبهذا أتممتَ وحدة ${unit} كاملة.`,
  },

  progress: {
    yourProgress: 'تقدُّمك',
    ofLessons: (completed, total) => `${arabicDigits(completed)} من ${arabicDigits(total)} درسًا`,
    barLabel: 'نسبة ما أتممتَه من الدروس',
  },

  completion: {
    title: 'تمَّ الدليل، والحمد لله',
    body: (lessons, units) =>
      `أتممتَ ${arCount(lessons, ['درسًا واحدًا', 'درسين', 'دروس', 'درسًا'])} في ${arCount(units, ['وحدةٍ واحدة', 'وحدتين', 'وحدات', 'وحدة'])}، من سؤال الوجود الأوّل إلى معنى أن تكون مسلمًا.`,
    nextStep:
      'قرأتَ الحجّة كاملة، وبقي ما لا يُقرأ: أن تسأل الله الهداية بصدق، وأن تحمل ما أشكل عليك إلى أهل العلم. فهذه الدروس تفتح الباب، والصدق مع الله يُدخلك منه.',
    review: 'راجِع بالأسئلة',
    cheatsheet: 'الخلاصة',
    allLessons: 'كلّ الدروس',
  },

  ayah: {
    surah: 'سورة',
    verse: 'الآية',
    partOfIt: ' (جزء منها)',
    openInContext: 'افتح الآية في سياقها',
    listenTo: (reciter) => `استمِع إلى الآية بصوت ${reciter}`,
    audioError: 'تعذَّر تشغيل التلاوة',
    audioLoading: 'جارٍ تحميل التلاوة',
    audioPlaying: 'إيقاف التلاوة',
    statusLoading: 'جارٍ التحميل',
    nowPlaying: 'يُتلى الآن',
    meaning: 'المعنى',
    staleData: 'غير موجودة في بيانات المصحف. شغِّل',
  },

  hadith: {
    label: 'حديث',
    source: 'المصدر',
  },

  doubt: {
    claim: 'يقولون',
    answer: 'والجواب',
  },

  callouts: {
    rule: 'خلاصة القول',
    tip: 'تأمَّل',
    note: 'انتبِه',
    warning: 'تنبيهٌ مهمّ',
  },

  quiz: {
    defaultTitle: 'اختبِر نفسك',
    correct: 'إجابةٌ صحيحة. ',
    correctIs: (answer) => `الصواب «${answer}». `,
    srCorrectAnswer: ' (الإجابة الصحيحة)',
    srPickedWrong: ' (اخترتَها، وهي خطأ)',
    verdictPerfect: 'ممتاز، أصبتَ في كلّ الأسئلة. انتقِل إلى الدرس التالي.',
    verdictRetry: 'راجِع ما أخطأتَ فيه ثمّ أعِد المحاولة.',
    retry: 'أعِد المحاولة',
  },

  practice: {
    title: 'مراجعةٌ مختلطة',
    intro: (roundSize) =>
      `${arabicDigits(roundSize)} أسئلةٍ مسحوبةٍ عشوائيًّا من كلّ الدروس. هذا هو الاختبار الحقيقيّ: أن يكون الجواب حاضرًا عندك، لا أن تتذكّر في أيّ درسٍ قرأتَه.`,
    bankSize: (n) => `بنك الأسئلة يحوي ${arabicDigits(n)} سؤالًا.`,
    newRound: 'أسئلةٌ أخرى',
    roundStatus: (round, size) =>
      `الجولة ${arabicDigits(round)}: ${arabicDigits(size)} أسئلةٍ جديدة.`,
    roundTitle: 'جولةٌ جديدة',
    noQuestions: 'لا توجد أسئلةٌ بعد. أضِف بلوك quiz إلى أيّ درسٍ وستظهر هنا تلقائيًّا.',
    missedOne: 'أخطأتَ في سؤال؟ ',
    missedOneLink: 'ارجِع إلى درسه',
    missedOneTail: ' واقرأه مرّةً أخرى؛ فالسؤال يكشف الموضع، والدرس يثبّته.',
  },

  glossary: {
    title: 'معجم المصطلحات',
    intro:
      'كلّ كلمةٍ اصطلاحيّةٍ في هذا الدليل، بتعريفٍ من سطرٍ أو سطرين ورابطٍ إلى درسها. إذا مرَّ بك مصطلحٌ في أثناء القراءة فابحث عنه هنا.',
    searchPlaceholder: 'ابحث عن مصطلح…',
    searchLabel: 'ابحث في المصطلحات',
    countStatus: (shown, total) => `${arabicDigits(shown)} من ${arabicDigits(total)} مصطلحًا`,
    noMatch: 'لا يوجد مصطلحٌ بهذا الاسم. جرّب كلمةً أقصر.',
    readLesson: 'اقرأ الدرس',
  },

  settings: {
    label: 'الإعدادات',
    reciterLegend: 'صوت التلاوة',
    transferTitle: 'تقدُّمك في الدروس',
    transferIntroEmpty:
      'لم تُتمّ درسًا بعد. وإن كان لك تقدُّمٌ محفوظٌ في متصفِّحٍ آخر فاستورِد ملفَّه هنا.',
    transferIntro: (completed, total) =>
      `المحفوظ على هذا الجهاز: ${arCount(completed, ['درسٌ واحد', 'درسان', 'دروس', 'درسًا'])} من ${arabicDigits(total)}. صدِّره في ملفٍّ لتنقله إلى متصفِّحٍ آخر؛ والاستيراد يُضيف إلى المحفوظ ولا يمحوه.`,
    exportButton: 'تصدير',
    importButton: 'استيراد',
    clearButton: 'مسح',
    confirmClear: 'تأكيد المسح',
    cancelClear: 'تراجُع',
    exported: 'نُزِّل ملفّ تقدُّمك.',
    cleared: 'مُسِح تقدُّمك على هذا الجهاز.',
    notAProgressFile: 'هذا ليس ملفّ تقدُّمٍ من هذا الدليل.',
    nothingRecognised: 'لم نجد في الملفّ أيّ درسٍ من دروس هذا الدليل.',
    imported: (saved, total) =>
      `تمّ الاستيراد. المحفوظ الآن ${arCount(saved, ['درسٌ واحد', 'درسان', 'دروس', 'درسًا'])} من ${arabicDigits(total)}.`,
    unreadableFile: 'تعذّرت قراءة الملفّ. اختر ملفًّا بصيغة JSON صدَّرتَه من هنا.',
  },

  notFound: {
    title: 'هذه الصفحة غير موجودة',
    body: 'ربّما تغيَّر الرابط، أو حُذفت الصفحة. عُد إلى قائمة الدروس وابدأ من هناك.',
    backHome: 'كلّ الدروس',
  },

  routeError: {
    reloading: 'صدرت نسخةٌ جديدة من الموقع، ونحن نُحدِّث الصفحة…',
    reloadingTitle: 'جارٍ التحديث',
    title: 'تعذَّر فتح هذه الصفحة',
    staleBody: 'يبدو أنّ نسخة الموقع المفتوحة عندك قديمة. أعِد تحميل الصفحة لتحصل على الجديدة.',
    genericBody:
      'حدث خطأٌ غير متوقَّع أثناء تحميل الصفحة. أعِد التحميل، فإن بقي الخطأ فعُد إلى قائمة الدروس.',
    progressSafe: 'تقدُّمك في الدروس محفوظٌ كما هو، ولا يتأثَّر بهذا.',
    reload: 'أعِد التحميل',
    backHome: 'كلّ الدروس',
  },

  footer: {
    line: 'دليلٌ مجّانيّ مفتوح المصدر إلى أصل الإيمان. ',
    aboutSources: 'اقرأ عن المصادر',
    contribute: 'ساهِم في تحسينه',
    verseCaption: (surahName, ayah) => `سورة ${surahName}، الآية ${arabicDigits(ayah)}`,
  },
}

const en: Strings = {
  digits: (value) => String(value),

  site: {
    name: 'Why Islam?',
    tagline: 'A calm guide from question to certainty',
  },

  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    opensNewTab: ' (opens in a new tab)',
    switchLanguage: 'اقرأ هذه الصفحة بالعربية',
  },

  nav: {
    lessons: 'Lessons',
    practice: 'Review',
    cheatsheet: 'Summary',
    glossary: 'Glossary',
    about: 'About',
  },

  theme: {
    toLight: 'Switch to the light theme',
    toDark: 'Switch to the dark theme',
  },
  backToTop: 'Back to top',

  home: {
    kicker: 'Reason first, then authentic sources',
    title: 'Why Islam?',
    titleAccent: 'From question to certainty',
    intro:
      'Does the universe have a Creator? Why can’t we see Him? Why is there suffering? And how do we know Muhammad ﷺ didn’t simply invent all of this? This guide doesn’t scold your questions; it takes them seriously: thirty lessons that walk from question to answer, one step at a time.',
    ctaStart: 'Start the first lesson',
    ctaContinue: 'Continue where you stopped',
    ctaRestart: 'Read again from lesson one',
    ctaCheatsheet: 'Go to the summary',
    stats: (lessons, units) =>
      `${lessons} lessons in ${units} units · Completely free · No account, no ads`,
    howToUseTitle: 'How to read this guide',
    howToUse: [
      {
        title: 'Read it fairly',
        body: 'Each lesson takes on one question, in plain language, and argues from reason and observation before it cites anything.',
      },
      {
        title: 'Stop at the verses',
        body: 'Listen to each verse from a master reciter and open it in context. The Qur’anic text here is copied from the mushaf letter for letter, never typed by hand.',
      },
      {
        title: 'Test your understanding',
        body: 'Every lesson ends with a few short questions that show you what stuck and what deserves a second read.',
      },
    ],
    curriculumTitle: 'The curriculum',
    curriculumIntro:
      'The order is deliberate: each unit builds only on what the ones before it established, so you are never asked to grant something that hasn’t been argued yet. Read it in order the first time; come back to anything whenever you like.',
    jumpToUnit: 'Jump to a unit',
    unitN: (n) => `Unit ${n}: `,
    lessonN: (n) => `Lesson ${n}: `,
    doneSr: ' (completed)',
  },

  lesson: {
    allLessons: 'All lessons',
    minutesRead: (n) => `About ${n} ${n === 1 ? 'minute' : 'minutes'} to read`,
    watch: 'Watch',
    goDeeper: 'Go deeper',
    markDone: 'Mark as done',
    markedDone: 'You finished this lesson',
    savedLocally: 'Your progress is saved on this device only: no account, no server.',
    prevLesson: 'Previous lesson',
    nextLesson: 'Next lesson',
    lessonNav: 'Lesson navigation',
    announceDone: (completed, total) =>
      `Lesson marked as done. You have finished ${completed} of ${total}.`,
    announceUnitDone: (unit) =>
      `Lesson marked as done, and with it you finished the whole unit: ${unit}.`,
    announceGuideDone: 'Lesson marked as done, and with it you finished the entire guide.',
    unitDoneLine: (unit) => `With this you finished the whole unit: ${unit}.`,
  },

  progress: {
    yourProgress: 'Your progress',
    ofLessons: (completed, total) => `${completed} of ${total} lessons`,
    barLabel: 'Share of lessons completed',
  },

  completion: {
    title: 'You finished the guide, and all praise belongs to Allah',
    body: (lessons, units) =>
      `You completed ${lessons} lessons in ${units} units, from the first question of existence to what being a Muslim actually means.`,
    nextStep:
      'You have read the whole argument. What remains cannot be read: ask Allah sincerely for guidance, and take whatever is still unclear to people of knowledge. These lessons open the door; honesty with Allah walks you through it.',
    review: 'Review with questions',
    cheatsheet: 'The summary',
    allLessons: 'All lessons',
  },

  ayah: {
    surah: 'Surah',
    verse: 'Verse',
    partOfIt: ' (part of it)',
    openInContext: 'Open the verse in context',
    listenTo: (reciter) => `Listen to the verse recited by ${reciter}`,
    audioError: 'The recitation could not be played',
    audioLoading: 'Loading the recitation',
    audioPlaying: 'Stop the recitation',
    statusLoading: 'Loading',
    nowPlaying: 'Now playing',
    meaning: 'Meaning',
    staleData: 'is missing from the mushaf data. Run',
  },

  hadith: {
    label: 'Hadith',
    source: 'Source',
  },

  doubt: {
    claim: 'They say',
    answer: 'The answer',
  },

  callouts: {
    rule: 'The point',
    tip: 'Reflect',
    note: 'Note',
    warning: 'Important',
  },

  quiz: {
    defaultTitle: 'Test yourself',
    correct: 'Correct. ',
    correctIs: (answer) => `The correct answer is “${answer}”. `,
    srCorrectAnswer: ' (the correct answer)',
    srPickedWrong: ' (your pick, and it is incorrect)',
    verdictPerfect: 'Excellent: you got every question right. On to the next lesson.',
    verdictRetry: 'Review what you missed, then try again.',
    retry: 'Try again',
  },

  practice: {
    title: 'Mixed review',
    intro: (roundSize) =>
      `${roundSize} questions drawn at random from every lesson. This is the real test: having the answer ready, not remembering which lesson you read it in.`,
    bankSize: (n) => `The question bank holds ${n} questions.`,
    newRound: 'New questions',
    roundStatus: (round, size) => `Round ${round}: ${size} new questions.`,
    roundTitle: 'A new round',
    noQuestions: 'No questions yet. Add a quiz block to any lesson and it appears here automatically.',
    missedOne: 'Missed one? ',
    missedOneLink: 'Go back to its lesson',
    missedOneTail: ' and read it again; the question finds the gap, the lesson closes it.',
  },

  glossary: {
    title: 'Glossary',
    intro:
      'Every technical term in this guide, defined in a line or two with a link to the lesson that explains it in full. If a word stops you mid-read, look it up here.',
    searchPlaceholder: 'Search terms…',
    searchLabel: 'Search the terms',
    countStatus: (shown, total) => `${shown} of ${total} terms`,
    noMatch: 'No term by that name. Try a shorter word.',
    readLesson: 'Read the lesson',
  },

  settings: {
    label: 'Settings',
    reciterLegend: 'Recitation voice',
    transferTitle: 'Your lesson progress',
    transferIntroEmpty:
      'You haven’t finished a lesson yet. If you have progress saved in another browser, import its file here.',
    transferIntro: (completed, total) =>
      `Saved on this device: ${completed} of ${total} lessons. Export it as a file to move it to another browser; importing adds to what is saved and never erases it.`,
    exportButton: 'Export',
    importButton: 'Import',
    clearButton: 'Clear',
    confirmClear: 'Confirm clearing',
    cancelClear: 'Cancel',
    exported: 'Your progress file was downloaded.',
    cleared: 'Your progress on this device was cleared.',
    notAProgressFile: 'This is not a progress file from this guide.',
    nothingRecognised: 'The file contains no lesson from this guide.',
    imported: (saved, total) => `Imported. Now saved: ${saved} of ${total} lessons.`,
    unreadableFile: 'The file could not be read. Choose a JSON file you exported from here.',
  },

  notFound: {
    title: 'This page does not exist',
    body: 'The link may have changed, or the page was removed. Head back to the lessons and start from there.',
    backHome: 'All lessons',
  },

  routeError: {
    reloading: 'A new version of the site was published; refreshing the page…',
    reloadingTitle: 'Refreshing',
    title: 'This page could not be opened',
    staleBody: 'The copy of the site open in this tab looks out of date. Reload the page to get the current one.',
    genericBody:
      'Something unexpected went wrong while loading the page. Reload it; if the error stays, go back to the lessons.',
    progressSafe: 'Your lesson progress is saved as it was and is not affected by this.',
    reload: 'Reload',
    backHome: 'All lessons',
  },

  footer: {
    line: 'A free, open-source guide to the foundation of faith. ',
    aboutSources: 'Read about the sources',
    contribute: 'Help improve it',
    verseCaption: (surahName, ayah) => `Surah ${surahName}, verse ${ayah}`,
  },
}

export const STRINGS: Record<Lang, Strings> = { ar, en }
