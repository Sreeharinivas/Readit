export const simplifyText = async (text: string): Promise<string> => {
  // Mock LLM simplification for demo purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      // Very basic mock simplification: 
      // In a real app, this would call an LLM API (e.g. OpenAI)
      const simplified = text
        .replace(/(\r\n|\n|\r)/gm, " ") // replace newlines with spaces
        .replace(/\s+/g, " ") // remove extra spaces
        .replace(/([.?!])\s*(?=[A-Z])/g, "$1\n\n") // add paragraphs back
        .trim();
        
      resolve(simplified || "No text could be processed.");
    }, 1500); // simulate network delay
  });
};
