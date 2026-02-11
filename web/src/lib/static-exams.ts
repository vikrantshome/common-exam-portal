export type Exam = {
  id: string;
  name: string;
  code: string;
  regStartDate: string;
  regEndDate: string;
  examDate: string;
  url: string;
  logo?: string;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING';
};

export const EXAMS: Exam[] = [
  {
    id: "1",
    name: "JEE Main 2026",
    code: "JEE_MAIN",
    regStartDate: "2025-11-01",
    regEndDate: "2025-12-01",
    examDate: "2026-01-24",
    url: "https://jeemain.nta.ac.in",
    status: "CLOSED"
  },
  {
    id: "2",
    name: "NEET UG 2026",
    code: "NEET",
    regStartDate: "2026-02-09",
    regEndDate: "2026-03-09",
    examDate: "2026-05-05",
    url: "https://exams.nta.ac.in/NEET",
    status: "UPCOMING"
  },
  {
    id: "3",
    name: "MHT CET 2026",
    code: "MHT_CET",
    regStartDate: "2026-01-16",
    regEndDate: "2026-03-01",
    examDate: "2026-04-16",
    url: "https://cetcell.mahacet.org",
    status: "OPEN"
  },
  {
    id: "4",
    name: "BITSAT 2026",
    code: "BITSAT",
    regStartDate: "2026-01-15",
    regEndDate: "2026-04-11",
    examDate: "2026-05-20",
    url: "https://www.bitsadmission.com",
    status: "OPEN"
  },
  {
    id: "5",
    name: "VITEEE 2026",
    code: "VITEEE",
    regStartDate: "2025-11-01",
    regEndDate: "2026-03-31",
    examDate: "2026-04-19",
    url: "https://vit.ac.in",
    status: "OPEN"
  },
  {
    id: "6",
    name: "SRMJEEE 2026",
    code: "SRMJEEE",
    regStartDate: "2025-11-01",
    regEndDate: "2026-04-15",
    examDate: "2026-04-20",
    url: "https://www.srmist.edu.in",
    status: "OPEN"
  }
];
