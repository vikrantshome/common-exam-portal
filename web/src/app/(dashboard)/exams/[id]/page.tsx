import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

async function getExam(id: string) {
  return await prisma.exam.findUnique({
    where: { id },
  });
}

export default async function ExamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { id } = await params;
  const exam = await getExam(id);

  if (!exam) notFound();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
           <h1 className="text-3xl font-bold tracking-tight">{exam.name}</h1>
           <Badge variant="secondary" className="text-lg">{exam.code}</Badge>
        </div>
        <Button size="lg" asChild>
          <a href={exam.officialUrl || "#"} target="_blank" rel="noopener noreferrer">
            Go to Official Website
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {exam.description || "No description available."}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-sm text-muted-foreground mb-1">Registration Starts</p>
                <p className="font-medium text-lg">
                  {exam.regStartDate ? new Date(exam.regStartDate).toLocaleDateString() : "TBA"}
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-sm text-muted-foreground mb-1">Registration Ends</p>
                <p className="font-medium text-lg text-red-600">
                  {exam.regEndDate ? new Date(exam.regEndDate).toLocaleDateString() : "TBA"}
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 sm:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Exam Date</p>
                <p className="font-medium text-lg text-primary">
                  {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "TBA"}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Apply with UniApply Plugin
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Use our browser extension to auto-fill your application on the official portal using your Master Profile.
            </p>
            <Button variant="default" disabled className="w-full sm:w-auto">
              Open Assistant (Coming Soon)
            </Button>
          </section>
        </div>

        <aside className="space-y-6">
           <div className="p-4 border rounded-lg shadow-sm">
             <h3 className="font-medium mb-4">Application Checklist</h3>
             <ul className="space-y-3 text-sm">
               <li className="flex items-center gap-2">
                 <div className="h-4 w-4 rounded-full border border-green-500 bg-green-500 flex items-center justify-center text-white text-[10px]">✓</div>
                 Personal Details
               </li>
               <li className="flex items-center gap-2">
                 <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                 Academic Records
               </li>
               <li className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                 Photo & Signature
               </li>
             </ul>
             <Button variant="outline" className="w-full mt-4" asChild>
               <Link href="/dashboard">Check Profile</Link>
             </Button>
           </div>
        </aside>
      </div>
    </div>
  );
}
