import { GoogleGenAI } from "@google/genai";
import { Invoice } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getFinancialHealthTips = async (invoices: Invoice[]): Promise<string[]> => {
  if (!API_KEY) {
    return Promise.resolve([
      "AI feature disabled: API key not configured.",
      "Tip: Ensure your invoices are sent promptly to clients.",
      "Tip: Keep accurate financial records to track your business growth effectively.",
      "Tip: Set clear payment terms with clients to improve cash flow.",
      "Tip: Regularly review your service pricing to ensure profitability.",
      "Tip: Consider offering package deals to increase average transaction value.",
      "Tip: Track client payment patterns to identify reliable customers.",
      "Tip: Keep a clear record of all your business expenses for record-keeping purposes.",
      "Tip: Regular invoicing helps maintain steady cash flow for your business."
    ]);
  }

  const invoiceCount = invoices.length;
  const totalVolume = invoices.reduce((sum, inv) => {
    const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
    return sum + subtotal;
  }, 0);
  const avgValue = invoiceCount > 0 ? totalVolume / invoiceCount : 0;

  const prompt = `You are a financial advisor for self-employed individuals and freelancers in the Philippines. Based on the following summary, provide 3 actionable, concise, and encouraging tips to improve financial stability and creditworthiness. The user has created ${invoiceCount} invoices with an average value of PHP ${avgValue.toFixed(2)}. Respond ONLY with a valid JSON array of 3 strings. Example: ["Tip 1...", "Tip 2...", "Tip 3..."]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini");
    }

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
        return parsedData;
    }
    throw new Error("Parsed data is not an array of strings.");

  } catch (error) {
    console.error("Failed to get financial tips from Gemini:", error);
    return ["We couldn't generate AI tips at the moment. Please try again later."];
  }
};
