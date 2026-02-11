import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ExternalLink, Globe, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

// Helper to calculate status
function getStatus(exam: any) {
    const now = new Date();
    if (!exam.regStartDate || !exam.regEndDate) return "CLOSED";
    if (now < exam.regStartDate) return "UPCOMING";
    if (now > exam.regEndDate) return "CLOSED";
    return "OPEN";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const exam = await prisma.exam.findUnique({ where: { id } });
  
  if (!exam) return { title: "Exam Not Found" };

  return {
    title: `Apply for ${exam.name} | UniApply India`,
    description: `One-click application for ${exam.name}. Registration ends on ${exam.regEndDate ? exam.regEndDate.toLocaleDateString() : 'TBA'}.`,
  };
}

export async function generateStaticParams() {
  const exams = await prisma.exam.findMany({ select: { id: true } });
  return exams.map((exam) => ({
    id: exam.id,
  }));
}

export default async function ExamDetailPage({ params }: Props) {
  const { id } = await params;
  const examRaw = await prisma.exam.findUnique({ where: { id } });

  if (!examRaw) {
    notFound();
  }

  // Normalize for UI
  const exam = {
      ...examRaw,
      status: getStatus(examRaw),
      regStartDate: examRaw.regStartDate || new Date(),
      regEndDate: examRaw.regEndDate || new Date(),
      examDate: examRaw.examDate || new Date(),
      url: examRaw.officialUrl || "#"
  };

  const statusColor = {
    OPEN: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
    UPCOMING: "bg-amber-100 text-amber-700 border-amber-200"
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${statusColor[exam.status as 'OPEN'|'CLOSED'|'UPCOMING']} border shadow-none`}>
                    {exam.status}
                  </Badge>
                  <span className="text-sm text-slate-500 font-mono">{exam.code}</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900">{exam.name}</h1>
              </div>
              <div className="flex gap-3">
                 <a href={exam.url} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="gap-2">
                        Official Website <Globe className="h-4 w-4" />
                    </Button>
                 </a>
                 {exam.status === 'OPEN' && (
                     <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                        Apply Now <ExternalLink className="h-4 w-4" />
                     </Button>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
            
            {/* Main Info */}
            <div className="md:col-span-2 space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Important Dates</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="bg-slate-50 border-slate-200 shadow-none">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-100">
                                    <CalendarDays className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Registration Window</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {exam.regStartDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {exam.regEndDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-slate-200 shadow-none">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-100">
                                    <AlertCircle className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Exam Date</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {exam.examDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Apply with UniApply</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-none h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Install the Extension</h3>
                                <p className="text-slate-600">Make sure you have the UniApply extension installed on your browser.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-none h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Complete your Profile</h3>
                                <p className="text-slate-600">Fill your details once in the <Link href="/profile/personal" className="text-indigo-600 hover:underline">UniApply Dashboard</Link>.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-none h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Go to Official Portal</h3>
                                <p className="text-slate-600">Click the "Apply Now" button above to visit {exam.url}. The extension will pop up automatically.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <Card className="border-indigo-100 bg-indigo-50/50">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            Auto-Fill Supported
                        </h3>
                        <p className="text-sm text-indigo-700 mb-4">
                            This exam is fully compatible with UniApply's auto-fill engine.
                        </p>
                        <ul className="text-sm space-y-2 text-indigo-800">
                            <li className="flex items-center gap-2">✓ Personal Details</li>
                            <li className="flex items-center gap-2">✓ Address & Contact</li>
                            <li className="flex items-center gap-2">✓ Marks & Grades</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
