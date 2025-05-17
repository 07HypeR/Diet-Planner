import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
});

export const CalculateCaloriesAi = async (PROMPT) =>
  await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: [{ role: "user", content: PROMPT }],
    response_format: "json_object",
  });

export const GenerateRecipe = async (PROMPT) =>
  await openai.chat.completions.create({
    model: "deepseek/deepseek-chat:free",
    messages: [{ role: "user", content: PROMPT }],
    response_format: "json_object",
  });

const BASE_URL = "https://diet-planner-image-server.onrender.com/api";
export const RecipeImageApi = axios.create({
  baseURL: BASE_URL,
});
