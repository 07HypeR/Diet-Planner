import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const CalculateCaloriesAi = async (PROMPT) =>
  await axios.post(
    `${GEMINI_API_URL}?key=${API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: PROMPT }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

export const GenerateRecipe = async (PROMPT) =>
  await axios.post(
    `${GEMINI_API_URL}?key=${API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: PROMPT }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

const BASE_URL = "https://diet-planner-image-server-p8rw.onrender.com/api";
export const RecipeImageApi = axios.create({
  baseURL: BASE_URL,
});
