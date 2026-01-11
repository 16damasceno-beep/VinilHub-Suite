
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingContent, Lead, MarketingPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSiteAndGenerateContent = async (
  siteUrl: string
): Promise<MarketingContent> => {
  // Usamos o gemini-3-pro-preview para tarefas complexas de análise e busca
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analise o site ${siteUrl}. O nome oficial é "Vinil Doro" (focado em venda de vinis no Brasil). 
    Identifique suas funcionalidades (venda C2C onde usuários vendem para outros usuários, compra direta, etc) e diferenciais competitivos.
    REGRAS IMPORTANTES:
    1. Use SEMPRE o nome "Vinil Doro".
    2. NÃO mencione "leilões" em nenhuma parte do texto.
    3. Destaque que usuários comuns podem vender seus próprios discos para outros colecionadores.
    
    Com base nisso, crie:
    1. Um Plano de Marketing (Tom de voz, USPs, Estratégia de crescimento).
    2. Mensagens persuasivas para WhatsApp, Instagram e Facebook em Português do Brasil.
    Foque em colecionadores brasileiros.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          plan: {
            type: Type.OBJECT,
            properties: {
              tone: { type: Type.STRING },
              usp: { type: Type.ARRAY, items: { type: Type.STRING } },
              strategy: { type: Type.STRING },
              targetAudience: { type: Type.STRING }
            },
            required: ["tone", "usp", "strategy", "targetAudience"]
          },
          whatsapp: { type: Type.STRING },
          instagram: { type: Type.STRING },
          facebook: { type: Type.STRING },
        },
        required: ["title", "plan", "whatsapp", "instagram", "facebook"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const findLeads = async (query: string): Promise<{ leads: Lead[], sources: any[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Encontre perfis de Instagram, grupos de Facebook ou sites de colecionadores de vinil, audiófilos e lojas independentes localizadas no BRASIL.
    A busca é: "${query}". 
    Foque APENAS em resultados brasileiros (sites .com.br ou perfis que mencionem cidades do Brasil).
    Retorne os dados estruturados em JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leads: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                platform: { type: Type.STRING, enum: ["WhatsApp", "Instagram", "Facebook", "Website"] },
                contact: { type: Type.STRING, description: "URL ou número de telefone ou arroba" },
                location: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "platform", "contact"]
            }
          }
        }
      }
    },
  });

  const parsed = JSON.parse(response.text);
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const leads = parsed.leads.map((l: any, index: number) => ({
    ...l,
    id: `lead-${Date.now()}-${index}`
  }));

  return { leads, sources };
};
