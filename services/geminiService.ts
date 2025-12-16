
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Python code generator for a simple file-based banking application.
Your task is to generate a single, complete Python function that performs a specific banking operation based on a user's command.
The banking system uses a simple dictionary stored in a JSON file named 'accounts.json'.
The dictionary format is: { "account_number": {"owner": "name", "balance": 100.0} }

Rules:
1.  ONLY output raw Python code.
2.  Do NOT include any explanations, comments, or markdown formatting like \`\`\`python.
3.  The function should handle file I/O (reading from and writing to 'accounts.json').
4.  The function should print a confirmation message upon success.
5.  Assume 'accounts.json' may not exist for the 'create_account' command and handle it gracefully.
6.  Import the 'json' module where needed.
`;

export const generatePythonCodeForCommand = async (command: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate the Python code for the command: '${command}'`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });
    
    if (response.text) {
        return response.text.trim();
    }
    
    return "# Unable to generate code for this command.";

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "# An error occurred while generating the code.";
  }
};
