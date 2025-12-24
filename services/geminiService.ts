// Service disabled to prevent runtime errors in browser environment
// The AI functionality has been removed as per request.

export const generateContentWithSearch = async (prompt: string): Promise<string> => {
  console.warn("AI features are disabled");
  return Promise.resolve("");
};

export const generateDeepContent = async (prompt: string): Promise<string> => {
  console.warn("AI features are disabled");
  return Promise.resolve("");
};