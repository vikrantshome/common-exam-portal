import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, FileText } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Master Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal data, academic records, and documents.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <Button
              asChild
              variant="ghost"
              className="justify-start hover:bg-transparent hover:underline"
            >
              <Link href="/profile/personal">
                <User className="mr-2 h-4 w-4" />
                Personal Details
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start hover:bg-transparent hover:underline"
            >
              <Link href="/profile/academic">
                <GraduationCap className="mr-2 h-4 w-4" />
                Academic Records
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start hover:bg-transparent hover:underline"
            >
              <Link href="/profile/documents">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </Link>
            </Button>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
