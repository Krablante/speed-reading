import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateContentWithSearch = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a comprehensive summary or article about the following topic, suitable for reading: "${prompt}". Use Google Search to get the latest information if relevant.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    // Append source links if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sourcesText = "";
    if (chunks) {
      const urls = chunks
        .map((c: any) => c.web?.uri)
        .filter((uri: string) => uri);
      if (urls.length > 0) {
        sourcesText = `\n\nSources:\n${urls.slice(0, 3).join('\n')}`;
      }
    }

    return text + sourcesText;
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};

export const generateDeepContent = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Write a deep, detailed, and well-structured explanation or essay on: "${prompt}". Focus on clarity and depth.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    return text;
  } catch (error) {
    console.error("Gemini Deep Think Error:", error);
    throw error;
  }
};
