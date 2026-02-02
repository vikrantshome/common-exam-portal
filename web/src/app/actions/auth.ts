"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const signupSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  mobile: z.string().min(10, "Invalid mobile number"),
  password: z.string().min(1, "Password is required"),
});

export type AuthState = {
  errors?: {
    mobile?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const result = signupSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { mobile, password } = result.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { mobile },
  });

  if (existingUser) {
    return {
      errors: {
        mobile: ["User with this mobile number already exists."],
      },
    };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  try {
    const user = await prisma.user.create({
      data: {
        mobile,
        password: hashedPassword,
      },
    });

    await createSession(user.id);
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to create account. Please try again."],
      },
    };
  }

  redirect("/dashboard");
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { mobile, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { mobile },
  });

  if (!user || !user.password) {
    return {
      errors: {
        _form: ["Invalid mobile number or password."],
      },
    };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return {
      errors: {
        _form: ["Invalid mobile number or password."],
      },
    };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
