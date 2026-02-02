"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

const onboardingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  stream: z.enum(["PCM", "PCB", "PCMB", "ARTS", "COMMERCE"]),
});

export type OnboardingState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    stream?: string[];
    _form?: string[];
  };
};

export async function submitOnboarding(prevState: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const session = await verifySession();
  if (!session || !session.userId) {
    redirect("/login");
  }

  const result = onboardingSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, stream } = result.data;

  try {
    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    if (existingProfile) {
      // Update existing profile
      await prisma.profile.update({
        where: { userId: session.userId },
        data: {
          firstName,
          lastName,
          class12Stream: stream,
        },
      });
    } else {
      // Create new profile
      await prisma.profile.create({
        data: {
          userId: session.userId,
          firstName,
          lastName,
          class12Stream: stream,
        },
      });
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      errors: {
        _form: ["Failed to save profile. Please try again."],
      },
    };
  }

  redirect("/dashboard");
}
