import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ExternalLink } from "lucide-react";
import { Exam } from "@/lib/static-exams";

export function ExamCard({ exam }: { exam: Exam }) {
  const statusColor = {
    OPEN: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200",
    UPCOMING: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-slate-900">{exam.name}</CardTitle>
          <Badge className={`${statusColor[exam.status]} border shadow-none font-semibold px-3`}>
            {exam.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center text-sm text-slate-600">
          <CalendarDays className="mr-2 h-4 w-4 text-indigo-500" />
          <span>Exam: {new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="text-sm text-slate-500">
          Registration: <span className="font-medium text-slate-700">
            {new Date(exam.regStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(exam.regEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t bg-slate-50/50">
        <Link href={`/exams/${exam.id}`} className="w-full">
          <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors py-2">
            View Details <ExternalLink className="h-4 w-4" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
