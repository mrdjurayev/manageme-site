export type MySubjectTeacher = {
  code?: string;
  name: string;
  subLabel?: string;
};

export type MySubjectPlanEntry = {
  id: number;
  topic: string;
  sessionDate: string;
  linkHref: string;
  linkLabel: string;
};

export type MySubjectItem = {
  id: number;
  title: string;
  teachers: MySubjectTeacher[];
  attendance: number;
  hasDownload: boolean;
  planEntries: MySubjectPlanEntry[];
};

export const MY_SUBJECTS_ITEMS: MySubjectItem[] = [
  {
    id: 1,
    title: "1st grade math",
    teachers: [
      {
        name: "Sal Khan",
      },
    ],
    attendance: 0,
    hasDownload: false,
    planEntries: [
      {
        id: 1,
        topic: "Number grid",
        sessionDate: "22.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-place-value/cc-1st-numbers-120/v/number-grid",
        linkLabel: "Open",
      },
      {
        id: 2,
        topic: "Missing numbers between 0 and 120",
        sessionDate: "23.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-place-value/cc-1st-numbers-120/v/numbers-to-120",
        linkLabel: "Open",
      },
      {
        id: 3,
        topic: "Intro to place value",
        sessionDate: "24.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-place-value/cc-1st-ones-tens/v/place-value-introduction",
        linkLabel: "Open",
      },
      {
        id: 4,
        topic: "Place value example: 25",
        sessionDate: "25.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-place-value/cc-1st-ones-tens/v/place-value-example",
        linkLabel: "Open",
      },
      {
        id: 5,
        topic: "Place value example: 42",
        sessionDate: "26.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-place-value/cc-1st-ones-tens/v/rep-quantity-with-digits",
        linkLabel: "Open",
      },
      {
        id: 6,
        topic: "Greater than and less than symbols",
        sessionDate: "27.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-place-value/cc-1st-two-digit-compare/v/greater-than-and-less-than-symbols",
        linkLabel: "Open",
      },
      {
        id: 7,
        topic: "Relating addition and subtraction",
        sessionDate: "28.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-subtract-10/v/relating-addition-and-subtraction",
        linkLabel: "Open",
      },
      {
        id: 8,
        topic: "Adding 7 + 6",
        sessionDate: "29.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-20/v/adding-within-20",
        linkLabel: "Open",
      },
      {
        id: 9,
        topic: "Adding 8 + 7",
        sessionDate: "30.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-20/v/adding-within-20-example",
        linkLabel: "Open",
      },
      {
        id: 10,
        topic: "Adding 5 + 3 + 6",
        sessionDate: "31.03.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-20/v/adding-3-numbers",
        linkLabel: "Open",
      },
      {
        id: 11,
        topic: "Subtracting 14 - 6",
        sessionDate: "01.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-sub-20/v/subtracting-within-20",
        linkLabel: "Open",
      },
      {
        id: 12,
        topic: "Equal sign",
        sessionDate: "02.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-equal-sign/v/equal-sign",
        linkLabel: "Open",
      },
      {
        id: 13,
        topic: "Addition and subtraction word problems: superheroes",
        sessionDate: "03.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-word-problems-within-20/v/sea-monsters-and-superheroes",
        linkLabel: "Open",
      },
      {
        id: 14,
        topic: "Addition and subtraction word problems: gorillas",
        sessionDate: "04.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-word-problems-within-20/v/exercising-gorillas",
        linkLabel: "Open",
      },
      {
        id: 15,
        topic: "Comparison word problems: marbles",
        sessionDate: "05.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-word-problems-more-fewer-20/v/comparison-word-problems",
        linkLabel: "Open",
      },
      {
        id: 16,
        topic: "Comparison word problems: roly-polies",
        sessionDate: "06.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-word-problems-more-fewer-20/v/more-comparison-word-problems?referrer=share_link",
        linkLabel: "Open",
      },
      {
        id: 17,
        topic: "Adding 1 vs. adding 10",
        sessionDate: "07.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-ones-tens/v/comparing-adding-1-and-10",
        linkLabel: "Open",
      },
      {
        id: 18,
        topic: "Understanding place value when adding tens",
        sessionDate: "08.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-ones-tens/v/understanding-place-value-while-adding-tens",
        linkLabel: "Open",
      },
      {
        id: 19,
        topic: "Understanding place value when adding ones",
        sessionDate: "09.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-ones-tens/v/understanding-place-value-when-adding-ones",
        linkLabel: "Open",
      },
      {
        id: 20,
        topic: "Adding 2-digit numbers without regrouping 1",
        sessionDate: "10.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-two-dig-intro/v/adding-two-digit-numbers-no-regrouping",
        linkLabel: "Open",
      },
      {
        id: 21,
        topic: "Adding 2-digit numbers without regrouping",
        sessionDate: "11.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-two-dig-intro/v/adding-two-digit-numbers-without-regrouping",
        linkLabel: "Open",
      },
      {
        id: 22,
        topic: "Breaking apart 2-digit addition problems",
        sessionDate: "12.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-two-dig-intro/v/breaking-apart-two-digit-addition-problems",
        linkLabel: "Open",
      },
      {
        id: 23,
        topic: "Regrouping to add 1-digit number",
        sessionDate: "13.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-two-dig-intro/v/regrouping-when-adding-two-digit-and-one-digit-number",
        linkLabel: "Open",
      },
      {
        id: 24,
        topic: "Adding by making a group of 10",
        sessionDate: "14.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-two-dig-intro/v/adding-by-getting-to-group-of-10-first",
        linkLabel: "Open",
      },
      {
        id: 25,
        topic: "Ordering by length",
        sessionDate: "15.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/copy-of-cc-early-math-length-intro/v/order-by-length",
        linkLabel: "Open",
      },
      {
        id: 26,
        topic: "Measuring length: golden statue",
        sessionDate: "16.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/copy-of-cc-early-math-length-intro/v/basic-measurement",
        linkLabel: "Open",
      },
      {
        id: 27,
        topic: "Reading bar graphs: dog bones",
        sessionDate: "17.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/cc-1st-bar-graphs/v/reading-bar-graph-examples",
        linkLabel: "Open",
      },
      {
        id: 28,
        topic: "Telling time (labeled clock)",
        sessionDate: "18.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/cc-1st-time/v/telling-time-exercise-example-1",
        linkLabel: "Open",
      },
      {
        id: 29,
        topic: "Cousin Fal's shape collection",
        sessionDate: "19.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/cc-1st-shapes/v/sides-corners",
        linkLabel: "Open",
      },
      {
        id: 30,
        topic: "Recognizing shapes",
        sessionDate: "20.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/cc-1st-shapes/v/recognizing-shapes",
        linkLabel: "Open",
      },
      {
        id: 31,
        topic: "Halves and fourths",
        sessionDate: "21.04.2026",
        linkHref: "https://www.khanacademy.org/math/cc-1st-grade-math/cc-1st-measurement-geometry/cc-1st-fractions-of-shapes/v/halves-and-fourths",
        linkLabel: "Open",
      },
    ],
  },
  {
    id: 2,
    title: "4th grade reading and vocab",
    teachers: [
      {
        name: "David Rheinstrom",
      },
    ],
    attendance: 0,
    hasDownload: false,
    planEntries: [
      {
        id: 1,
        topic: "Finding the main idea in nonfiction",
        sessionDate: "03.02.2026",
        linkHref: "https://www.khanacademy.org/ela",
        linkLabel: "Open",
      },
      {
        id: 2,
        topic: "Context clues and domain vocabulary",
        sessionDate: "10.02.2026",
        linkHref: "https://www.khanacademy.org/ela",
        linkLabel: "Open",
      },
      {
        id: 3,
        topic: "Character traits and supporting evidence",
        sessionDate: "17.02.2026",
        linkHref: "https://www.khanacademy.org/ela",
        linkLabel: "Open",
      },
      {
        id: 4,
        topic: "Summarizing informational texts",
        sessionDate: "24.02.2026",
        linkHref: "https://www.khanacademy.org/ela",
        linkLabel: "Open",
      },
      {
        id: 5,
        topic: "Theme, tone, and figurative language",
        sessionDate: "03.03.2026",
        linkHref: "https://www.khanacademy.org/ela",
        linkLabel: "Open",
      },
      {
        id: 6,
        topic: "Comparing two texts on the same topic",
        sessionDate: "10.03.2026",
        linkHref: "https://www.khanacademy.org/ela",
        linkLabel: "Open",
      },
    ],
  },
  {
    id: 3,
    title: "Computers and the Internet",
    teachers: [
      {
        name: "Khan Academy",
        subLabel: "TM",
      },
    ],
    attendance: 0,
    hasDownload: false,
    planEntries: [
      {
        id: 1,
        topic: "What makes up a computer system",
        sessionDate: "03.02.2026",
        linkHref: "https://www.khanacademy.org/computing/computers-and-internet",
        linkLabel: "Open",
      },
      {
        id: 2,
        topic: "Safe browsing and digital citizenship",
        sessionDate: "10.02.2026",
        linkHref: "https://www.khanacademy.org/computing/computers-and-internet",
        linkLabel: "Open",
      },
      {
        id: 3,
        topic: "How the internet moves information",
        sessionDate: "17.02.2026",
        linkHref: "https://www.khanacademy.org/computing/computers-and-internet",
        linkLabel: "Open",
      },
      {
        id: 4,
        topic: "Search strategies and source checking",
        sessionDate: "24.02.2026",
        linkHref: "https://www.khanacademy.org/computing/computers-and-internet",
        linkLabel: "Open",
      },
      {
        id: 5,
        topic: "Intro to files, folders, and cloud storage",
        sessionDate: "03.03.2026",
        linkHref: "https://www.khanacademy.org/computing/computers-and-internet",
        linkLabel: "Open",
      },
      {
        id: 6,
        topic: "Networks, passwords, and account security",
        sessionDate: "10.03.2026",
        linkHref: "https://www.khanacademy.org/computing/computers-and-internet",
        linkLabel: "Open",
      },
    ],
  },
  {
    id: 4,
    title: "World history",
    teachers: [
      {
        name: "Sal Khan",
      },
    ],
    attendance: 0,
    hasDownload: false,
    planEntries: [
      {
        id: 1,
        topic: "Early river valley civilizations",
        sessionDate: "04.02.2026",
        linkHref: "https://www.khanacademy.org/humanities/world-history",
        linkLabel: "Open",
      },
      {
        id: 2,
        topic: "Ancient Greece and the birth of democracy",
        sessionDate: "11.02.2026",
        linkHref: "https://www.khanacademy.org/humanities/world-history",
        linkLabel: "Open",
      },
      {
        id: 3,
        topic: "Rome: republic, empire, and legacy",
        sessionDate: "18.02.2026",
        linkHref: "https://www.khanacademy.org/humanities/world-history",
        linkLabel: "Open",
      },
      {
        id: 4,
        topic: "Trade routes and cultural exchange",
        sessionDate: "25.02.2026",
        linkHref: "https://www.khanacademy.org/humanities/world-history",
        linkLabel: "Open",
      },
      {
        id: 5,
        topic: "The Middle Ages across Europe and Asia",
        sessionDate: "04.03.2026",
        linkHref: "https://www.khanacademy.org/humanities/world-history",
        linkLabel: "Open",
      },
      {
        id: 6,
        topic: "Renaissance ideas and global exploration",
        sessionDate: "11.03.2026",
        linkHref: "https://www.khanacademy.org/humanities/world-history",
        linkLabel: "Open",
      },
    ],
  },
];
