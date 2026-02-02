import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AcademicDetailsForm } from "@/components/profile/academic-details-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  
  if (!profile) return null;
  return profile;
}

export default async function AcademicDetailsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const profile = await getProfile(session.userId);

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Records</h1>
        <p className="text-muted-foreground">
          Your educational background for eligibility checks.
        </p>
      </div>
      <AcademicDetailsForm profile={profile} />
    </div>
  );
}
