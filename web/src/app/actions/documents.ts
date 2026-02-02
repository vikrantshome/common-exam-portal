"use server";

import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export type UploadState = {
  message?: string;
  error?: string;
};

export async function uploadDocument(prevState: UploadState, formData: FormData): Promise<UploadState> {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  const type = formData.get("type") as string;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  if (!type) {
    return { error: "Document type is required" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.name.split('.').pop();
    const filename = `${type}-${uniqueSuffix}.${ext}`;
    
    // Define upload path (public/uploads)
    const uploadDir = join(process.cwd(), "public/uploads");
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filepath = join(uploadDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Save to Database
    const fileUrl = `/uploads/${filename}`;
    
    // Check if document of this type already exists, if so update it
    const existingDoc = await prisma.document.findFirst({
      where: {
        userId: session.userId,
        type: type,
      },
    });

    if (existingDoc) {
      await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          url: fileUrl,
          size: file.size,
          mimeType: file.type,
        },
      });
    } else {
      await prisma.document.create({
        data: {
          userId: session.userId,
          type: type,
          url: fileUrl,
          size: file.size,
          mimeType: file.type,
        },
      });
    }

    revalidatePath("/profile/documents");
    return { message: "Document uploaded successfully!" };

  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload document." };
  }
}
