import { openai } from "../config/openaiConfig.js";

// --- SYSTEM PROMPT ---
const systemPrompt = `
You are an expert Indian mess chef and recipe designer.
Your task is to generate creative variations of a given meal for a student mess.

Guidelines:
- Suggest 2 to 3 creative recipe variations.
- Follow the selected style (e.g., North Indian, Chinese, Healthy).
- Match the requested taste profile (e.g., Spicy, Mild, Tangy).
- Assume you're cooking for the given number of students.
- Include the optional message hint if provided.
- Each recipe must be clear, practical for large-scale cooking, and affordable.

Output Rules:
- Respond ONLY in **valid JSON**, no extra text.
- JSON format:

{
  "meal": "Dal Tadka",
  "style": "North Indian",
  "taste": "Spicy",
  "quantity": 200,
  "recipes": [
    {
      "name": "Garlic Dal Fry with Smoky Tadka",
      "description": "A spicy North Indian dal infused with garlic and smoky ghee tadka.",
      "ingredients": [
        "2 kg toor dal",
        "200g garlic",
        "250g ghee",
        "Spices: turmeric, red chili, cumin seeds, salt"
      ],
      "steps": [
        "Boil toor dal until soft.",
        "In ghee, fry garlic and spices until golden.",
        "Mix tadka into dal and simmer for 5 mins."
      ],
      "estimatedTime": "40 mins"
    }
  ]
}
`;

export async function generateRecipeAI({ meal, style, taste, quantity, message }) {
  try {
    const userPrompt = `
Meal: ${meal}
Style: ${style}
Taste: ${taste}
Quantity: ${quantity}
Message: ${message || "No extra message"}

Generate recipe variations following these details.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message?.content;
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to generate recipes");
  }
}
