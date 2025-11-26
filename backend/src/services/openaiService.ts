import OpenAI from "openai";
import { config } from "../config";
import { StructuredMedicalData } from "../models/MedicalRecord";

export const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

/**
 * Summarizes medical text into a concise summary
 * @param text - The medical text to summarize
 * @returns A summary string
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const system = "You are an expert medical scribe. Summarize clinical documents in less than 120 words focusing on key vitals, diagnosis, medications, follow-ups.";
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: text.slice(0, 4000) }
      ],
      temperature: 0.3
    });
    return response.choices[0]?.message?.content || "Unable to summarize";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Unable to summarize";
  }
};

/**
 * Extracts structured medical data from text using OpenAI
 * @param text - The medical text to extract from
 * @returns Structured medical data object
 */
export const extractStructuredMedicalData = async (text: string): Promise<StructuredMedicalData> => {
  const systemPrompt = `You are a medical data extraction expert. Extract structured information from medical records and return ONLY valid JSON in this exact format:
{
  "diagnosis": "string or null",
  "medications": ["array of medication strings"],
  "labValues": {"key": "value"} or {},
  "vitals": {"key": "value"} or {},
  "doctorNotes": "string or null",
  "allergies": ["array of allergy strings"],
  "doctorName": "string or null",
  "recordType": "string or null"
}

Extract:
- diagnosis: Primary diagnosis or condition mentioned
- medications: All medications, dosages, and frequencies
- labValues: Lab test results (e.g., {"hb": "10.5 g/dL", "wbc": "7000/mm3"})
- vitals: Vital signs (e.g., {"bp": "120/80", "pulse": "72 bpm"})
- doctorNotes: Any clinical notes or observations
- allergies: Any mentioned allergies
- doctorName: Name of the treating doctor
- recordType: Type of record (e.g., "Blood Test Report", "Prescription", "X-Ray Report")

Return ONLY the JSON object, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Extract medical data from:\n\n${text.slice(0, 8000)}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {};
    }

    const parsed = JSON.parse(content) as Partial<StructuredMedicalData>;
    return {
      diagnosis: parsed.diagnosis || undefined,
      medications: Array.isArray(parsed.medications) ? parsed.medications : [],
      labValues: parsed.labValues && typeof parsed.labValues === "object" ? parsed.labValues : {},
      vitals: parsed.vitals && typeof parsed.vitals === "object" ? parsed.vitals : {},
      doctorNotes: parsed.doctorNotes || undefined,
      allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
      doctorName: parsed.doctorName || undefined,
      recordType: parsed.recordType || undefined
    };
  } catch (error) {
    console.error("Error extracting structured medical data:", error);
    return {};
  }
};

/**
 * Extracts structured medical data from an image/PDF using OpenAI Vision
 * @param fileUrl - URL of the medical document image
 * @returns Structured medical data object
 */
export const extractStructuredDataFromImage = async (fileUrl: string): Promise<StructuredMedicalData> => {
  const systemPrompt = `You are a medical data extraction expert. Analyze this medical document image and extract structured information. Return ONLY valid JSON in this exact format:
{
  "diagnosis": "string or null",
  "medications": ["array of medication strings"],
  "labValues": {"key": "value"} or {},
  "vitals": {"key": "value"} or {},
  "doctorNotes": "string or null",
  "allergies": ["array of allergy strings"],
  "doctorName": "string or null",
  "recordType": "string or null"
}

Extract all visible medical information. Return ONLY the JSON object, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all medical data from this document." },
            { type: "image_url", image_url: { url: fileUrl, detail: "high" } }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {};
    }

    const parsed = JSON.parse(content) as Partial<StructuredMedicalData>;
    return {
      diagnosis: parsed.diagnosis || undefined,
      medications: Array.isArray(parsed.medications) ? parsed.medications : [],
      labValues: parsed.labValues && typeof parsed.labValues === "object" ? parsed.labValues : {},
      vitals: parsed.vitals && typeof parsed.vitals === "object" ? parsed.vitals : {},
      doctorNotes: parsed.doctorNotes || undefined,
      allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
      doctorName: parsed.doctorName || undefined,
      recordType: parsed.recordType || undefined
    };
  } catch (error) {
    console.error("Error extracting structured data from image:", error);
    return {};
  }
};
