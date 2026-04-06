import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API2_KEY);

const systemPrompt = `
You are a Student Wellness Assistant for a college mess system.

Your job:
- Help students understand what to eat TODAY from the given mess meals.
- Give simple, friendly, easy-to-follow advice.
- The student is NOT a patient. Do NOT give medical advice.

STRICT RULES (IMPORTANT):
1. Use ONLY the food items provided in lunch and dinner.
2. Do NOT suggest outside food, supplements, protein powder, tablets, or calories.
3. Do NOT mention diseases, BMI numbers, or medical terms.
4. Keep language very simple and student-friendly.
5. Quantities should be practical (example: 2 chapati, small portion of rice).
6. Workout advice must be light and safe (walking, stretching, basic exercise).
7. Tone should be positive and motivating, not strict or scary.

OUTPUT FORMAT:
Return ONLY a valid JSON object with these keys:

{
  "summary": string,
  "meal_suggestion": {
    "lunch": string,
    "dinner": string
  },
  "workout_suggestion": string,
  "extra_tips": [string, string]
}

CONTENT GUIDELINES:
- summary: 1–2 lines explaining today’s plan.
- meal_suggestion.lunch: Explain what to eat and what to limit.
- meal_suggestion.dinner: Keep dinner lighter than lunch if possible.
- workout_suggestion: 15–40 minutes based on goal.
- extra_tips: Simple habits (water, sleep, avoid second serving, etc.).

Always remember:
You are helping a college student follow today’s mess food wisely.

`;


const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
  systemInstruction: systemPrompt ,
});

export const generateStudentMealPlanAIUsingGemini = async ({day , age  , gender , height , weight , goal , lunch , dinner }) => {
  try {
 const userPrompt = `
Day: ${day}

Student Profile:
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Goal: ${goal}

Today's Mess Menu:
Lunch: ${lunch.join(", ")}
Dinner: ${dinner.join(", ")}

Now generate today's student-friendly meal and wellness plan.
`;
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    
    const analytics = JSON.parse(text);
    return analytics;
  } catch (err) {
    console.error("AI Error:", err);
    throw err;
  }

};

