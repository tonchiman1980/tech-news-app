
import { GoogleGenAI, Type } from "@google/genai";

export const handler = async (event: any) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API_KEY is not set in Netlify Environment Variables." }),
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `あなたは最新テックニュースを投資家向けに、かつ中学生でも分かるように解説するトップアナリストです。
  最新の24時間以内のテックニュース（AI、半導体、クラウド、EV、量子コンピュータ等）を3件検索して取得してください。
  返答はJSON形式のみで行ってください。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  whyImportant: { type: Type.STRING },
                  risks: { type: Type.STRING },
                  companies: {
                    type: Type.OBJECT,
                    properties: {
                      japan: { type: Type.ARRAY, items: { type: Type.STRING } },
                      us: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                required: ["title", "importance", "originalText", "summary", "whyImportant", "risks", "companies"]
              }
            }
          },
          required: ["articles"]
        }
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: response.text,
        candidates: response.candidates
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
