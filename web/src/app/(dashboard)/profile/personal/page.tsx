import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PersonalDetailsForm } from "@/components/profile/personal-details-form";
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

export default async function PersonalDetailsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const profile = await getProfile(session.userId);

  // If no profile exists (shouldn't happen if onboarding is forced), redirect or show error.
  // We'll assume profile exists because of middleware/onboarding flow.
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
        <h1 className="text-3xl font-bold tracking-tight">Master Profile</h1>
        <p className="text-muted-foreground">
          Update your personal information. This data will be auto-filled in your exam forms.
        </p>
      </div>
      <PersonalDetailsForm profile={profile} />
    </div>
  );
}
