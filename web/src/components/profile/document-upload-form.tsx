"use client";

import { useState } from "react";
import { uploadDocument } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import imageCompression from "browser-image-compression";

type Document = {
  id: string;
  type: string;
  url: string;
  updatedAt: Date;
};

const DOC_TYPES = [
  { id: "PHOTO", label: "Passport Photograph", required: true, maxSizeMB: 0.2, maxWidthOrHeight: 800 },
  { id: "SIGNATURE", label: "Scanned Signature", required: true, maxSizeMB: 0.1, maxWidthOrHeight: 600 },
  { id: "AADHAR", label: "ID Proof (Aadhar/Passport)", required: true, maxSizeMB: 0.5, maxWidthOrHeight: 1200 },
  { id: "CATEGORY_CERT", label: "Category Certificate", required: false, maxSizeMB: 0.5, maxWidthOrHeight: 1200 },
];

function SingleDocumentUpload({ docType, existingDoc }: { docType: any, existingDoc?: Document }) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);

    try {
      // Compression options
      const options = {
        maxSizeMB: docType.maxSizeMB,
        maxWidthOrHeight: docType.maxWidthOrHeight,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      
      setIsCompressing(false);
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("type", docType.id);

      // Call Server Action
      // We call the action directly here instead of using form action to handle the compressed file
      const result = await uploadDocument({}, formData);

      if (result.error) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage("Uploaded successfully!");
      }

    } catch (error) {
      console.error(error);
      setMessage("Compression failed.");
    } finally {
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-start justify-between border p-4 rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
           <Label className="font-medium text-base">{docType.label}</Label>
           {docType.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Max size: {docType.maxSizeMB * 1000}KB
        </p>
        
        {existingDoc && (
          <div className="mt-2">
            <a href={existingDoc.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline">
              View Current Upload
            </a>
            <p className="text-xs text-muted-foreground">Last updated: {new Date(existingDoc.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
        
        {message && (
          <p className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="relative">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isCompressing || isUploading}
            className="w-[250px]"
          />
        </div>
        {(isCompressing || isUploading) && (
           <span className="text-xs text-muted-foreground animate-pulse">
             {isCompressing ? "Compressing..." : "Uploading..."}
           </span>
        )}
      </div>
    </div>
  );
}

export function DocumentUploadForm({ documents }: { documents: Document[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Vault</CardTitle>
        <CardDescription>
          Upload your documents once. We'll resize them for each exam.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DOC_TYPES.map((type) => {
          const existingDoc = documents.find(d => d.type === type.id);
          return (
            <SingleDocumentUpload key={type.id} docType={type} existingDoc={existingDoc} />
          );
        })}
      </CardContent>
    </Card>
  );
}
