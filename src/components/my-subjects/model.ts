export type MySubjectTeacher = {
  code?: string;
  name: string;
  subLabel?: string;
};

export type MySubjectItem = {
  id: number;
  title: string;
  teachers: MySubjectTeacher[];
  attendance: number;
  hasDownload: boolean;
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
  },
];
