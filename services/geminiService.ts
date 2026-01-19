
import { GoogleGenAI } from "@google/genai";
import { NewsResponse, GroundingSource } from "../types";

// 安全な環境変数取得（iPhone Safariでのエラー防止）
const getLocalApiKey = () => {
  try {
    // プレビュー環境の process.env.API_KEY を取得。
    // process が未定義の場合は undefined を返す
    return typeof process !== 'undefined' ? process.env?.API_KEY : null;
  } catch {
    return null;
  }
};

const PROMPT = `最新の24時間以内のテックニュースを3件取得し、投資家向けの分析をJSONで返してください。`;

export const fetchBreakingNews = async (): Promise<{ data: NewsResponse; sources: GroundingSource[] }> => {
  const localKey = getLocalApiKey();

  // 1. プレビュー環境（API_KEYが直接使える場合）
  if (localKey && !window.location.hostname.includes('netlify.app')) {
    try {
      const ai = new GoogleGenAI({ apiKey: localKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: PROMPT,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        },
      });

      const sources: GroundingSource[] = [];
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
        if (chunk.web) sources.push({ title: chunk.web.title || "Source", uri: chunk.web.uri });
      });

      return {
        data: JSON.parse(response.text || "{\"articles\":[]}"),
        sources: Array.from(new Map(sources.map(s => [s.uri, s])).values())
      };
    } catch (err) {
      console.warn("Direct SDK failed, falling back to API...", err);
    }
  }

  // 2. Netlify本番環境（/api/gemini 経由で呼び出す）
  const response = await fetch('/api/gemini');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "ニュースを取得できませんでした。Netlifyの環境変数設定を確認してください。");
  }

  const result = await response.json();
  const sources: GroundingSource[] = [];
  result.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
    if (chunk.web) sources.push({ title: chunk.web.title || "Source", uri: chunk.web.uri });
  });

  return {
    data: JSON.parse(result.text),
    sources: Array.from(new Map(sources.map(s => [s.uri, s])).values())
  };
};
