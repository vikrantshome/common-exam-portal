"use client";

import { useActionState } from "react";
import { updatePersonalDetails, ProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

// Define a type that matches the Prisma Profile model structure we need
type ProfileData = {
  firstName: string;
  lastName?: string | null;
  dob?: Date | null;
  gender?: string | null;
  category?: string | null;
  aadharNo?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
};

const initialState: ProfileState = {
  errors: {},
};

export function PersonalDetailsForm({ profile }: { profile: ProfileData }) {
  const [state, formAction, isPending] = useActionState(updatePersonalDetails, initialState);

  // Format Date for Input
  const formattedDob = profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : "";

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            These details will be used for your exam applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {state.message && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm font-medium">
              {state.message}
            </div>
          )}
          
          {/* Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" defaultValue={profile.firstName} required />
              {state.errors?.firstName && <p className="text-red-500 text-xs">{state.errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" defaultValue={profile.lastName || ""} />
            </div>
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input type="date" id="dob" name="dob" defaultValue={formattedDob} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup name="gender" defaultValue={profile.gender || "MALE"} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Category & Aadhar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={profile.category || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GEN">General</SelectItem>
                  <SelectItem value="OBC">OBC-NCL</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="EWS">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadharNo">Aadhar Number</Label>
              <Input id="aadharNo" name="aadharNo" defaultValue={profile.aadharNo || ""} maxLength={12} placeholder="12-digit UID" />
              {state.errors?.aadharNo && <p className="text-red-500 text-xs">{state.errors.aadharNo}</p>}
            </div>
          </div>

          {/* Parents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input id="fatherName" name="fatherName" defaultValue={profile.fatherName || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input id="motherName" name="motherName" defaultValue={profile.motherName || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Permanent Address</Label>
            <Textarea id="address" name="address" defaultValue={profile.address || ""} placeholder="House No, Street, Locality" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={profile.city || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue={profile.state || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" defaultValue={profile.pincode || ""} maxLength={6} />
              {state.errors?.pincode && <p className="text-red-500 text-xs">{state.errors.pincode}</p>}
            </div>
          </div>

          {state.errors?._form && (
            <p className="text-sm text-red-500">{state.errors._form}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Details"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
