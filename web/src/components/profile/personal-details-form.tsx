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
  email?: string | null;
  dob?: Date | null;
  gender?: string | null;
  category?: string | null;
  aadharNo?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  
  // Present Address
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  alternateMobile?: string | null;

  // Permanent Address
  sameAsPresent: boolean;
  permAddressLine1?: string | null;
  permAddressLine2?: string | null;
  permCity?: string | null;
  permDistrict?: string | null;
  permState?: string | null;
  permCountry?: string | null;
  permPincode?: string | null;
};

const initialState: ProfileState = {
  errors: {},
};

export function PersonalDetailsForm({ profile }: { profile: ProfileData }) {
  const [state, formAction, isPending] = useActionState(updatePersonalDetails, initialState);
  // Simple state for checkbox toggle visual
  // Note: We use defaultValue for initial render, actual toggle logic is native HTML behavior for now
  // Real-time hiding would require useState, but let's keep it simple for MVP - just show all fields.

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={profile.email || ""} placeholder="student@example.com" />
              {state.errors?.email && <p className="text-red-500 text-xs">{state.errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternateMobile">Alternate Mobile No.</Label>
              <Input id="alternateMobile" name="alternateMobile" defaultValue={profile.alternateMobile || ""} placeholder="Parent's Mobile" />
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

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Present Address</h3>
            <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1 (Premises/House No)</Label>
                <Input id="addressLine1" name="addressLine1" defaultValue={profile.addressLine1 || ""} placeholder="House No, Building" />
            </div>

            <div className="space-y-2 mt-2">
                <Label htmlFor="addressLine2">Address Line 2 (Locality/Area)</Label>
                <Input id="addressLine2" name="addressLine2" defaultValue={profile.addressLine2 || ""} placeholder="Area, Landmark" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="space-y-2">
                <Label htmlFor="city">City/Village</Label>
                <Input id="city" name="city" defaultValue={profile.city || ""} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" name="district" defaultValue={profile.district || ""} />
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
            
            <div className="space-y-2 mt-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue={profile.country || "India"} />
            </div>
          </div>

          <div className="border-t pt-4 mt-4 bg-muted/20 p-4 rounded-md">
            <div className="flex items-center space-x-2 mb-4">
                <h3 className="font-semibold">Permanent Address</h3>
                <div className="flex items-center space-x-2 ml-4">
                    <Checkbox id="sameAsPresent" name="sameAsPresent" defaultChecked={profile.sameAsPresent} value="true" />
                    <Label htmlFor="sameAsPresent" className="font-normal cursor-pointer">Same as Present Address</Label>
                </div>
            </div>
            
            <div className="text-xs text-muted-foreground mb-4">
                If unchecked, fill the details below.
            </div>

            <div className="space-y-2">
                <Label htmlFor="permAddressLine1">Address Line 1</Label>
                <Input id="permAddressLine1" name="permAddressLine1" defaultValue={profile.permAddressLine1 || ""} placeholder="House No, Building" />
            </div>

            <div className="space-y-2 mt-2">
                <Label htmlFor="permAddressLine2">Address Line 2</Label>
                <Input id="permAddressLine2" name="permAddressLine2" defaultValue={profile.permAddressLine2 || ""} placeholder="Area, Landmark" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="space-y-2">
                <Label htmlFor="permCity">City/Village</Label>
                <Input id="permCity" name="permCity" defaultValue={profile.permCity || ""} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="permDistrict">District</Label>
                <Input id="permDistrict" name="permDistrict" defaultValue={profile.permDistrict || ""} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="permState">State</Label>
                <Input id="permState" name="permState" defaultValue={profile.permState || ""} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="permPincode">Pincode</Label>
                <Input id="permPincode" name="permPincode" defaultValue={profile.permPincode || ""} maxLength={6} />
                </div>
            </div>
            
            <div className="space-y-2 mt-2">
                <Label htmlFor="permCountry">Country</Label>
                <Input id="permCountry" name="permCountry" defaultValue={profile.permCountry || "India"} />
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

import { Checkbox } from "@/components/ui/checkbox";
