import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DocumentUploadForm } from "@/components/profile/document-upload-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getDocuments(userId: string) {
  return await prisma.document.findMany({
    where: { userId },
  });
}

export default async function DocumentsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const documents = await getDocuments(session.userId);

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
        <h1 className="text-3xl font-bold tracking-tight">Document Vault</h1>
        <p className="text-muted-foreground">
          Manage your photographs, signatures, and certificates.
        </p>
      </div>
      <DocumentUploadForm documents={documents} />
    </div>
  );
}
