import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await verifySession();
  
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { 
        mobile: true,
        email: true
      },
    });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    const documents = await prisma.document.findMany({
      where: { userId: session.userId },
      select: { type: true, url: true, mimeType: true, size: true },
    });

    return NextResponse.json({
      user,
      profile,
      documents
    });
  } catch (error) {
    console.error("Extension API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
