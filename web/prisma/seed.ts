import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXAMS = [
  {
    name: "JEE Main 2026",
    code: "JEE_MAIN",
    regStartDate: new Date("2025-11-01"),
    regEndDate: new Date("2025-12-01"),
    examDate: new Date("2026-01-24"),
    officialUrl: "https://jeemain.nta.ac.in",
    description: "Joint Entrance Examination (Main) for admission to NITs, IIITs, and CFTIs."
  },
  {
    name: "NEET UG 2026",
    code: "NEET",
    regStartDate: new Date("2026-02-09"),
    regEndDate: new Date("2026-03-09"),
    examDate: new Date("2026-05-05"),
    officialUrl: "https://exams.nta.ac.in/NEET",
    description: "National Eligibility cum Entrance Test for admission to MBBS/BDS courses."
  },
  {
    name: "MHT CET 2026",
    code: "MHT_CET",
    regStartDate: new Date("2026-01-16"),
    regEndDate: new Date("2026-03-01"),
    examDate: new Date("2026-04-16"),
    officialUrl: "https://cetcell.mahacet.org",
    description: "Maharashtra Common Entrance Test for Engineering and Pharmacy."
  },
  {
    name: "BITSAT 2026",
    code: "BITSAT",
    regStartDate: new Date("2026-01-15"),
    regEndDate: new Date("2026-04-11"),
    examDate: new Date("2026-05-20"),
    officialUrl: "https://www.bitsadmission.com",
    description: "Birla Institute of Technology and Science Admission Test."
  },
  {
    name: "VITEEE 2026",
    code: "VITEEE",
    regStartDate: new Date("2025-11-01"),
    regEndDate: new Date("2026-03-31"),
    examDate: new Date("2026-04-19"),
    officialUrl: "https://vit.ac.in",
    description: "VIT Engineering Entrance Examination."
  },
  {
    name: "SRMJEEE 2026",
    code: "SRMJEEE",
    regStartDate: new Date("2025-11-01"),
    regEndDate: new Date("2026-04-15"),
    examDate: new Date("2026-04-20"),
    officialUrl: "https://www.srmist.edu.in",
    description: "SRM Joint Engineering Entrance Examination."
  }
];

async function main() {
  console.log(`Start seeding ...`);
  for (const exam of EXAMS) {
    const result = await prisma.exam.upsert({
      where: { code: exam.code },
      update: exam,
      create: exam,
    });
    console.log(`Created/Updated exam: ${result.name}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
