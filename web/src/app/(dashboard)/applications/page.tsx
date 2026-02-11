import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getExams() {
  return await prisma.exam.findMany();
}

export default async function ExamsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const exams = await getExams();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Exams</h1>
        <p className="text-muted-foreground">
          Browse and apply for entrance examinations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{exam.name}</CardTitle>
                <Badge variant="outline">{exam.code}</Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {exam.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exam Date:</span>
                  <span className="font-medium">
                    {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "TBA"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reg Closes:</span>
                  <span className="font-medium text-red-600">
                    {exam.regEndDate ? new Date(exam.regEndDate).toLocaleDateString() : "TBA"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/exams/${exam.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
