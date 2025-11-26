import { openai } from "./openaiService";

/**
 * Extracts text from medical document images using OpenAI Vision
 * @param fileUrl - URL of the medical document image
 * @returns Extracted text content
 */
export const runOCR = async (fileUrl: string): Promise<string> => {
  try {
    const prompt = "Extract all textual content from this medical document. Return plain text separated by new lines.";
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: fileUrl, detail: "high" } }
          ]
        }
      ],
      max_tokens: 2000
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error running OCR:", error);
    return "";
  }
};
