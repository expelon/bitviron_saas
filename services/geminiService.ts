import { GoogleGenAI } from "@google/genai";

// Fix: Removed maxOutputTokens to allow the model to manage its own thinking budget and simplified initialization
export async function summarizeText(text: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following text into 3 concise bullet points: \n\n${text}`,
    config: {
      temperature: 0.7,
    }
  });

  // Fix: Directly accessing .text property (not a method) as per SDK specifications
  return response.text || "Failed to generate summary.";
}

// Fix: Updated to use gemini-3-pro-preview which is recommended for complex coding tasks
export async function cleanCode(code: string, language: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Please beautify and clean the following ${language} code. Return ONLY the cleaned code block, no explanations: \n\n${code}`,
  });

  // Fix: Directly accessing .text property (not a method) as per SDK specifications
  return response.text || "Failed to clean code.";
}