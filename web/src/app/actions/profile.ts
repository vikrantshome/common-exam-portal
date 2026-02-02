"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  dob: z.string().optional(), // Receive as string YYYY-MM-DD
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  category: z.enum(["GEN", "OBC", "SC", "ST", "EWS"]).optional(),
  aadharNo: z.string().length(12, "Aadhar must be 12 digits").optional().or(z.literal("")),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().length(6, "Pincode must be 6 digits").optional().or(z.literal("")),
});

const academicDetailsSchema = z.object({
  class10Board: z.string().optional(),
  class10School: z.string().optional(),
  class10Percentage: z.coerce.number().min(0).max(100).optional(),
  class10Year: z.coerce.number().min(2000).max(new Date().getFullYear()).optional(),
  class10RollNo: z.string().optional(),
  
  class12Board: z.string().optional(),
  class12School: z.string().optional(),
  class12Status: z.enum(["APPEARING", "PASSED"]).optional(),
  class12Stream: z.string().optional(),
});

export type ProfileState = {
  message?: string;
  errors?: {
    firstName?: string[];
    dob?: string[];
    aadharNo?: string[];
    pincode?: string[];
    class10Percentage?: string[];
    class10Year?: string[];
    _form?: string[];
  };
};

export async function updatePersonalDetails(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const rawData = Object.fromEntries(formData);
  const result = personalDetailsSchema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    await prisma.profile.update({
      where: { userId: session.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob ? new Date(data.dob) : null,
        gender: data.gender,
        category: data.category,
        aadharNo: data.aadharNo || null,
        fatherName: data.fatherName,
        motherName: data.motherName,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile/personal");
    
    return { message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      errors: {
        _form: ["Failed to update profile. Please try again."],
      },
    };
  }
}

export async function updateAcademicDetails(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const rawData = Object.fromEntries(formData);
  const result = academicDetailsSchema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    await prisma.profile.update({
      where: { userId: session.userId },
      data: {
        class10Board: data.class10Board,
        class10School: data.class10School,
        class10Percentage: data.class10Percentage || null,
        class10Year: data.class10Year || null,
        class10RollNo: data.class10RollNo,
        
        class12Board: data.class12Board,
        class12School: data.class12School,
        class12Status: data.class12Status,
        // class12Stream is handled in onboarding, but can be updated here if needed
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile/academic");
    
    return { message: "Academic details updated successfully!" };
  } catch (error) {
    console.error("Academic update error:", error);
    return {
      errors: {
        _form: ["Failed to update academic details. Please try again."],
      },
    };
  }
}
