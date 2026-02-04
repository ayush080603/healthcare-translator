import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function translateText(text, fromLang, toLang) {
  try {
    // Using gemini-pro which is more stable
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });
    
    const prompt = `Translate the following text from ${fromLang} to ${toLang}. 
Return ONLY the translation, no explanations or additional text.

Text to translate: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const translation = result.response.text().trim();
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export async function generateConversationSummary(messages) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });
    
    const conversationText = messages.map(msg => 
      `${msg.sender_role.toUpperCase()}: ${msg.original_text}`
    ).join('\n');
    
    const prompt = `You are a medical assistant. Analyze this doctor-patient conversation and create a structured summary.

Conversation:
${conversationText}

Provide a summary with these sections:
1. Chief Complaint/Symptoms
2. Medical History Mentioned
3. Diagnosis or Assessment
4. Medications Prescribed
5. Follow-up Instructions
6. Important Notes

Keep it concise and medically relevant.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
}