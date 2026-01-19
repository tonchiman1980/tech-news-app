
import { GoogleGenAI, Type } from "@google/genai";
import { NewsResponse, GroundingSource } from "../types";

export const fetchBreakingNews = async (): Promise<{ data: NewsResponse; sources: GroundingSource[] }> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("APIキーが設定されていません。Netlifyの環境変数を確認してください。");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `あなたは最新テックニュースを投資家向けに、かつ中学生でも分かるように解説するトップアナリストです。
  
  最新の24時間以内のテックニュース（AI、半導体、クラウド、EV、量子コンピュータ等）を3件検索して取得してください。
  
  返信は以下のJSON形式で、日本語で回答してください。
  JSON以外の説明文は一切含めないでください。
  
  {
    "articles": [
      {
        "title": "ニュースタイトル",
        "importance": "★★★★★",
        "originalText": "ニュースの要旨（事実ベース）",
        "summary": "中学生でもわかる平易な言葉での解説。専門用語は噛み砕くこと。",
        "whyImportant": "投資家が注目すべき理由、今後の市場への影響。",
        "risks": "懸念されるリスクや不確実性。",
        "companies": {
          "japan": ["関連する日本企業 (証券コード)"],
          "us": ["関連する米国企業 (ティッカー)"]
        }
      }
    ]
  }`;

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

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Reference Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      data: JSON.parse(text),
      sources: Array.from(new Map(sources.map(s => [s.uri, s])).values()) // Deduplicate
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("403")) {
      throw new Error("APIキーの権限エラーです。Google AI Studioで有効化されているか確認してください。");
    }
    throw error;
  }
};
