export type DashboardCardItem = {
  id: number;
  title: string;
  description: string;
  modalIntro?: string;
  modalDescription?: string;
  modalDescriptionHighlight?: string;
  modalListItems?: string[];
  dateTime: string;
};

export const DASHBOARD_CARD_ITEMS: DashboardCardItem[] = [
  {
    id: 1,
    title: "Website overview",
    description: "This website was developed by AJ and tracks learning progress over time.",
    modalDescription:
      "This web page is currently specifically designed for a particular user and serves that user exclusively. In this application, the user receives quality education within an LMS (Learning Management System) environment. The application provides announcements, news, subjects, class schedules, assignments, final exam status, an individual personal plan, and many other sections. All of these are designed to be clear and understandable for the student.",
    dateTime: "13.03.2026 | 21:30",
  },
  {
    id: 2,
    title: "Assignment review",
    description:
      "Assignments uploaded to the system are reviewed automatically or with AI support, and the results are highly accurate.",
    modalDescription:
      "The user can upload assignments to this system throughout the semester, and they will be reviewed and graded based on specific criteria. To do this, the student needs to go to the Assignments section and monitor the process.",
    dateTime: "13.03.2026 | 21:10",
  },
  {
    id: 3,
    title: "Semester structure",
    description:
      "The system has four semesters each year. During these semesters, students study, complete practical training, and take final exams.",
    modalDescription:
      "To ensure high-quality education, the year is divided into seasons, and each season lasts for three months. For each season, subjects, final exams, class schedules, and other relevant sections are updated.",
    dateTime: "13.03.2026 | 20:50",
  },
  {
    id: 4,
    title: "Attendance rules",
    description:
      "Students must familiarize themselves with the system's attendance rules and the terms of the contract.",
    modalDescription:
      "An attendance system has been established to ensure the student’s consistent learning. The student can monitor their own attendance status. Additional information and requirements are available in the Contract terms section.",
    modalDescriptionHighlight: "Contract terms",
    dateTime: "13.03.2026 | 21:05",
  },
  {
    id: 5,
    title: "Assignments",
    description: "Students must complete assignments on time and upload them to the system.",
    modalDescription:
      "The system assigns specific tasks to the user and typically gives about one week to complete them. The student must complete them on time and according to the specified requirements.",
    dateTime: "13.03.2026 | 21:20",
  },
  {
    id: 6,
    title: "Assessment criteria",
    description:
      "Students are evaluated based on their activity during the season and the results of their assigned tasks.",
    modalDescription:
      "As mentioned above, the student earns certain points for the assignments given and for participation in class. To take the final exam, the student is required to accumulate enough points. Points and results are recorded at the end of the season and updated in the new season.",
    dateTime: "13.03.2026 | 21:35",
  },
  {
    id: 7,
    title: "Contract terms",
    description:
      "The terms of the contract are established between the system and the student, and compliance with them is mandatory.",
    modalIntro:
      "This agreement is established between ManageMe and the student in order to prevent potential misunderstandings and issues. According to this agreement, the student is required to strictly fulfill their responsibilities.",
    modalListItems: [
      "The student will be taught subjects assigned for the specific academic term",
      "Each subject has a defined tuition fee",
      "The maximum score that can be obtained for each subject is 50 points",
      "The maximum score for the final exam is 50 points",
      "A minimum of 40 points is required to be eligible for the final exam",
      "If the student’s score is below 40, they will not be allowed to take the final exam and must retake the subject",
      "To pass the final exam, the student must score at least 35 points",
      "If the student scores below 35 on the final exam, they will be required to retake the subject",
      "The student must not miss classes without a valid reason",
      "If a student misses more than 3 classes in a subject during the term, they will be required to retake that subject",
      "If a student is more than 10 minutes late to a class, they will be marked as absent automatically",
    ],
    dateTime: "13.03.2026 | 21:40",
  },
];
