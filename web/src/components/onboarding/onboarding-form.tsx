"use client";

import { useActionState } from "react";
import { submitOnboarding, OnboardingState } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: OnboardingState = {
  errors: {},
};

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(submitOnboarding, initialState);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome! Let's get to know you.</CardTitle>
        <CardDescription>
          We need a few details to set up your master profile.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" placeholder="John" required />
              {state.errors?.firstName && (
                <p className="text-sm text-red-500">{state.errors.firstName}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" />
              {state.errors?.lastName && (
                <p className="text-sm text-red-500">{state.errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="stream">Class 12 Stream</Label>
            <Select name="stream" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PCM">PCM (Physics, Chemistry, Maths)</SelectItem>
                <SelectItem value="PCB">PCB (Physics, Chemistry, Biology)</SelectItem>
                <SelectItem value="PCMB">PCMB (Both)</SelectItem>
                <SelectItem value="COMMERCE">Commerce</SelectItem>
                <SelectItem value="ARTS">Arts / Humanities</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.stream && (
              <p className="text-sm text-red-500">{state.errors.stream}</p>
            )}
          </div>

          {state.errors?._form && (
            <p className="text-sm text-red-500">{state.errors._form}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Continue to Dashboard"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
