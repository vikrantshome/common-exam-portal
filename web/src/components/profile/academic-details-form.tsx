"use client";

import { useActionState } from "react";
import { updateAcademicDetails, ProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type ProfileData = {
  class10Board?: string | null;
  class10School?: string | null;
  class10Percentage?: number | null;
  class10Year?: number | null;
  class10RollNo?: string | null;
  
  class12Board?: string | null;
  class12School?: string | null;
  class12Status?: string | null;
  class12Stream?: string | null;
};

const initialState: ProfileState = {
  errors: {},
};

export function AcademicDetailsForm({ profile }: { profile: ProfileData }) {
  const [state, formAction, isPending] = useActionState(updateAcademicDetails, initialState);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Academic Records</CardTitle>
          <CardDescription>
            Enter your Class 10 and Class 12 details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {state.message && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm font-medium">
              {state.message}
            </div>
          )}

          {/* Class 10 Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Class 10 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class10Board">Board Name</Label>
                <Select name="class10Board" defaultValue={profile.class10Board || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="STATE">State Board</SelectItem>
                    <SelectItem value="IB">IB</SelectItem>
                    <SelectItem value="IGCSE">IGCSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class10School">School Name</Label>
                <Input id="class10School" name="class10School" defaultValue={profile.class10School || ""} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class10Year">Passing Year</Label>
                <Input type="number" id="class10Year" name="class10Year" defaultValue={profile.class10Year || ""} placeholder="2024" />
                {state.errors?.class10Year && <p className="text-red-500 text-xs">{state.errors.class10Year}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="class10Percentage">Percentage / CGPA</Label>
                <Input type="number" step="0.01" id="class10Percentage" name="class10Percentage" defaultValue={profile.class10Percentage || ""} placeholder="95.5" />
                {state.errors?.class10Percentage && <p className="text-red-500 text-xs">{state.errors.class10Percentage}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="class10RollNo">Roll No</Label>
                <Input id="class10RollNo" name="class10RollNo" defaultValue={profile.class10RollNo || ""} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Class 12 Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Class 12 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class12Status">Status</Label>
                <Select name="class12Status" defaultValue={profile.class12Status || "APPEARING"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPEARING">Appearing (Current Year)</SelectItem>
                    <SelectItem value="PASSED">Passed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="class12Board">Board Name</Label>
                 <Select name="class12Board" defaultValue={profile.class12Board || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ISC">ISC</SelectItem>
                    <SelectItem value="STATE">State Board</SelectItem>
                    <SelectItem value="IB">IB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="class12School">School Name</Label>
                <Input id="class12School" name="class12School" defaultValue={profile.class12School || ""} />
              </div>
          </div>

          {state.errors?._form && (
            <p className="text-sm text-red-500">{state.errors._form}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Academic Records"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
