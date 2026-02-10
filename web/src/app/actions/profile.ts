"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dob: z.string().optional(), // Receive as string YYYY-MM-DD
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  category: z.enum(["GEN", "OBC", "SC", "ST", "EWS"]).optional(),
  aadharNo: z.string().length(12, "Aadhar must be 12 digits").optional().or(z.literal("")),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  
  // Contact Details (Present)
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().length(6, "Pincode must be 6 digits").optional().or(z.literal("")),
  alternateMobile: z.string().optional(),

  // Contact Details (Permanent)
  sameAsPresent: z.string().optional(), // Checkbox sends "true" string
  permAddressLine1: z.string().optional(),
  permAddressLine2: z.string().optional(),
  permCity: z.string().optional(),
  permDistrict: z.string().optional(),
  permState: z.string().optional(),
  permCountry: z.string().optional(),
  permPincode: z.string().length(6, "Pincode must be 6 digits").optional().or(z.literal("")),
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
    email?: string[];
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
    // Update Profile
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
        
        // Present
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        district: data.district,
        state: data.state,
        country: data.country,
        pincode: data.pincode || null,
        alternateMobile: data.alternateMobile,

        // Permanent
        sameAsPresent: data.sameAsPresent === "true",
        permAddressLine1: data.permAddressLine1,
        permAddressLine2: data.permAddressLine2,
        permCity: data.permCity,
        permDistrict: data.permDistrict,
        permState: data.permState,
        permCountry: data.permCountry,
        permPincode: data.permPincode || null,
      },
    });

    // Update User Email if provided
    if (data.email) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { email: data.email },
      });
    }

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
