import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using the latest Gemini 2.5 Flash model as requested
const MODEL_NAME = "gemini-2.5-flash"; 

const SYSTEM_PROMPT = `
You are an expert Form Mapping Agent. Your goal is to map HTML Form Fields (Skeleton) to the "UniApply Standard Profile Schema".

### UniApply Schema (Source Keys):
- profile.firstName, profile.lastName, profile.fatherName, profile.motherName
- profile.dob (Format: YYYY-MM-DD), profile.gender (MALE, FEMALE, OTHER)
- profile.category (GEN, OBC, SC, ST, EWS)
- user.mobile, user.email, profile.alternateMobile
- profile.addressLine1 (Present Premises), profile.addressLine2 (Present Locality)
- profile.city, profile.district, profile.state, profile.country, profile.pincode
- profile.sameAsPresent (Boolean)
- profile.permAddressLine1, profile.permAddressLine2, profile.permCity, profile.permDistrict
- profile.permState, profile.permCountry, profile.permPincode
- profile.domicileState (e.g., "Maharashtra")

### Instructions:
1. Analyze the provided JSON Skeleton.
2. Identify fields that match the UniApply Schema.
3. Return a JSON object with a "fields" array.

### Special Rules (PRIORITY):
1. **Full Name Strategy:** 
   - If the label is "Candidate's Name", "Student Name", "Applicant Name" or just "Name": **MAP TO COMPOSITE** \`["profile.firstName", "profile.lastName"]\`.
   - ONLY map to \`profile.firstName\` if the label explicitly says "First Name".
   - If the form asks for "Father's Name" separately, do NOT include fatherName in the candidate name composite.

2. **Split Date Fields:** 
   - If you see 3 selects for DOB (Day, Month, Year), map ALL of them to \`profile.dob\`. The executor handles the split.

3. **Enum Fields (Gender/Country/State):**
   - Map these directly to their profile keys. The executor handles text-to-value matching.

4. **Confirmation Fields:**
   - Map "Confirm X" to the SAME source as "X".

5. **Permanent Address Strategy:**
   - Look for a "Same As Present Address" checkbox.
   - If \`profile.sameAsPresent\` is TRUE (or missing): Map the CHECKBOX to a "click" action. Do NOT map the permanent fields (as they will be hidden/disabled).
   - If \`profile.sameAsPresent\` is FALSE: Do NOT click the checkbox. Map the Permanent Address fields (permAddressLine1, etc.) to the corresponding inputs.

### Advanced Interaction Logic (Complex Components):
For React-Select, Shadow DOM, or Custom Dropdowns, generate an **Action Sequence**:
- "click": Container/Toggle.
- "type": Input (simulated).
- "key": "Enter".

### Output Format (Strict JSON):
{
  "fields": [
    {
      "selector": "string (css selector)",
      "source": "string" OR ["string", "string"] OR boolean (for checkboxes),
      "separator": "string", 
      "confidence": number (0-1),
      "format": "string",
      "actions": [...]
    }
  ]
}
`;

export async function POST(req: NextRequest) {
  try {
    const { skeleton } = await req.json();

    if (!skeleton || !Array.isArray(skeleton)) {
      return NextResponse.json({ error: "Invalid Skeleton" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing. Returning Mock Map.");
      return NextResponse.json(mockMap(skeleton), {
        headers: corsHeaders()
      });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig: { responseMimeType: "application/json" } });
    
    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] }
        ]
    });

    console.log(`Sending skeleton to AI (${MODEL_NAME})...`);
    // Pass a sample of the skeleton to avoid huge context if many fields, but for now full skeleton
    const result = await chat.sendMessage(`Here is the Form Skeleton (Note 'role', 'type', and hidden inputs):\n${JSON.stringify(skeleton)}`);
    const responseText = result.response.text();
    console.log("AI Response Raw:", responseText);

    // Robust JSON Parsing (Strip Markdown code blocks if present)
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json/, "").replace(/```$/, "");
    } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```/, "").replace(/```$/, "");
    }

    const jsonMap = JSON.parse(jsonStr);

    return NextResponse.json(jsonMap, {
      headers: corsHeaders()
    });

  } catch (error: any) {
    console.error("AI Mapping Error Details:", error);
    // Return the actual error message to the client for debugging
    return NextResponse.json({ 
        error: "Internal Server Error", 
        details: error.message || String(error) 
    }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: corsHeaders(),
  });
}

// Fallback for testing when no API Key is present
function mockMap(skeleton: any[]) {
    // Simple heuristic matcher to simulate AI
    const fields = skeleton.map(field => {
        const label = field.label.toLowerCase();
        let source: string | string[] | null = null;

        if (label.includes("name") && !label.includes("father") && !label.includes("mother")) source = ["profile.firstName", "profile.lastName"];
        if (label.includes("father")) source = "profile.fatherName";
        if (label.includes("mother")) source = "profile.motherName";
        if (label.includes("mobile")) source = "user.mobile";
        if (label.includes("email")) source = "user.email";
        if (label.includes("gender")) source = "profile.gender";
        if (label.includes("birth") || label.includes("dob")) source = "profile.dob";

        if (source) {
            return {
                selector: field.selector,
                source,
                confidence: 0.8,
                reason: "Mock Match"
            };
        }
        return null;
    }).filter(Boolean);

    return { fields };
}