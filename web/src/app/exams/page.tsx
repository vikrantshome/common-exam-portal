import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ExamCard } from "@/components/landing/ExamCard";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Supported Exams | UniApply India",
  description: "Browse the list of engineering, medical, and other entrance exams supported by UniApply India's auto-fill extension.",
};

// Helper to calculate status
function getStatus(exam: any) {
    const now = new Date();
    if (now < exam.regStartDate) return "UPCOMING";
    if (now > exam.regEndDate) return "CLOSED";
    return "OPEN";
}

export default async function ExamDirectoryPage() {
  const examsRaw = await prisma.exam.findMany();
  
  // Transform to match ExamCard props
  const exams = examsRaw.map(e => ({
      ...e,
      id: e.id,
      name: e.name,
      code: e.code,
      regStartDate: e.regStartDate ? e.regStartDate.toISOString() : "",
      regEndDate: e.regEndDate ? e.regEndDate.toISOString() : "",
      examDate: e.examDate ? e.examDate.toISOString() : "",
      url: e.officialUrl || "",
      status: getStatus(e) as 'OPEN' | 'CLOSED' | 'UPCOMING'
  }));

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Supported Exams</h1>
            <p className="text-lg text-slate-600">
              We currently support auto-filling for {exams.length} major Indian entrance exams. More are added every week.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
