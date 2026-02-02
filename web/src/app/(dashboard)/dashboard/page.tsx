import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

async function getUserData(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  const documentCount = await prisma.document.count({
    where: { userId },
  });
  return { profile, documentCount };
}

async function getUpcomingExams() {
  const today = new Date();
  console.log("Fetching exams. Today is:", today);
  const exams = await prisma.exam.findMany({
    where: {
      regEndDate: {
        gte: today, // Only show exams where registration is still open (or closes in future)
      },
    },
    orderBy: {
      regEndDate: "asc",
    },
    take: 5,
  });
  console.log("Exams fetched:", exams.length);
  return exams;
}

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { profile, documentCount } = await getUserData(session.userId);
  const upcomingExams = await getUpcomingExams();

  // Calculate completion percentage logic
  let completionPercentage = 20; // Basic details (onboarding) exist
  if (profile?.dob && profile?.aadharNo) completionPercentage += 20;
  if (profile?.address) completionPercentage += 10;
  if (profile?.class10Board) completionPercentage += 25; // Academic
  if (documentCount > 0) completionPercentage += 25; // Documents
  
  if (completionPercentage > 100) completionPercentage = 100;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.firstName || "Student"}! Here's your exam application status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completionPercentage < 100 ? (
                <Link href="/profile/personal" className="text-primary hover:underline">
                  Complete your profile &rarr;
                </Link>
              ) : (
                "Profile complete!"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Open for registration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Master Profile Status</CardTitle>
            <CardDescription>
              Your data hub for all exam applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="font-medium">Personal Details</p>
                <p className="text-sm text-muted-foreground">Name, DOB, Category</p>
              </div>
              <div className="flex items-center">
                {profile?.dob && profile?.aadharNo ? (
                   <span className="text-green-600 text-sm font-medium">Completed</span>
                ) : (
                   <Button variant="outline" size="sm" asChild>
                     <Link href="/profile/personal">Fill Now</Link>
                   </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="font-medium">Academic Records</p>
                <p className="text-sm text-muted-foreground">Class 10 & 12 Marks</p>
              </div>
               <div className="flex items-center">
                 {profile?.class10Board ? (
                   <span className="text-green-600 text-sm font-medium">Completed</span>
                 ) : (
                   <Button variant="outline" size="sm" asChild>
                     <Link href="/profile/academic">Fill Now</Link>
                   </Button>
                 )}
               </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Documents</p>
                <p className="text-sm text-muted-foreground">Photo, Signature, IDs</p>
              </div>
               <div className="flex items-center">
                 {documentCount > 0 ? (
                   <span className="text-green-600 text-sm font-medium">Completed ({documentCount})</span>
                 ) : (
                   <Button variant="outline" size="sm" asChild>
                     <Link href="/profile/documents">Upload</Link>
                   </Button>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Don't miss these important dates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming deadlines found.</p>
              ) : (
                upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex items-center">
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{exam.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Reg closes: <span className="text-red-500 font-medium">
                          {exam.regEndDate ? new Date(exam.regEndDate).toLocaleDateString() : "TBA"}
                        </span>
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/exams/${exam.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
              
               <div className="pt-4 text-center">
                 <Button variant="link" asChild className="text-primary">
                    <Link href="/exams">View All Exams</Link>
                 </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}