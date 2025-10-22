import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// // ✅ Available models: gemini-1.5-flash or gemini-1.5-pro
const model = genAI.getGenerativeModel({  model: 'gemini-2.0-flash-001' ,
     generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
  systemInstruction : `
You are an AI assistant that analyzes student meal feedbacks.
You will receive an array of feedbacks with the following fields:
- user: string
- meal: string
- Date: string (ISO format)
- overallRating: number (1-5)
- itemFeedback: object with each meal item { rating, comment, positiveTags, negativeTags }
- positiveTags: array of strings
- negativeTags: array of strings
- comment: string

Analyze all feedbacks and return a JSON object with the following structure:

{
  "summary": {
    "totalFeedbacks": number,
    "averageRating": number
  },
  "positiveFeedbacks": {
    "count": number
  },
  "negativeFeedbacks": {
    "count": number
  },
  "spammingUsers": {
    "count": number,
    "list": [array of usernames who submitted 2+ feedbacks]
  },
  "mostPositiveMeals": {
    "count": number,
    "meals": [
      {
        "name": string,
        "averageRating": number,
        "comments": [array of positive comments for this meal]
      }
    ]
  },
  "mostNegativeMeals": {
    "count": number,
    "meals": [
      {
        "name": string,
        "averageRating": number,
        "negativeComments": [array of negative comments for this meal]
      }
    ]
  },
  "sentimentDistribution": {
    "1_star": number,
    "2_star": number,
    "3_star": number,
    "4_star": number,
    "5_star": number
  },
  "mealAnalysis": [
    {
      "meal": string,
      "averageRating": number,
      "positiveComments": [array],
      "negativeComments": [array]
    }
  ],
  "aiSuggestions": {
    "goodPoints": [array],
    "badPoints": [array]
  },
  "aiSummaryText": string
}

Return **only JSON** and do not add any explanations.
`
 });


 export const generateAnalytics = async (feedbackArray) => {
  try {
    const prompt = `
Feedback array:
${JSON.stringify(feedbackArray)}
`;


    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    console.log("AI Analytics JSON:", text);

    // Optionally parse JSON
    const analytics = JSON.parse(text);
    return analytics;

  } catch (err) {
    console.error("AI Error:", err);
    throw err;
  }
};




// ✅ Available models: gemini-1.5-flash or gemini-1.5-pro
// const model = genAI.getGenerativeModel({
//   model: 'gemini-2.0-flash-001',
//   generationConfig: {
//     responseMimeType: "application/json",
//     temperature: 0.3,
//   },
// });

/**
 * Utility: Retry Gemini request with exponential backoff if rate-limited (429)
 */
// async function generateWithRetry(prompt, retries = 3, delay = 2000) {
//   try {
//     const result = await model.generateContent(prompt);
//     const text = await result.response.text();
//     return text;
//   } catch (error) {
//     if (error.status === 429 && retries > 0) {
//       console.warn(`⚠️ Rate limited — retrying in ${delay / 1000}s (${retries} retries left)...`);
//       await new Promise(res => setTimeout(res, delay));
//       return generateWithRetry(prompt, retries - 1, delay * 2);
//     }

//     // Handle other errors (network, invalid response, etc.)
//     console.error("❌ Gemini API Error:", error);
//     throw error;
//   }
// }

/**
 * Generate feedback analytics via Gemini API
 */
// export const generateAnalytics = async (feedbackArray) => {
//   // Optional: batch if feedbackArray is huge
//   const BATCH_SIZE = 20;
//   const allAnalytics = [];

//   for (let i = 0; i < feedbackArray.length; i += BATCH_SIZE) {
//     const batch = feedbackArray.slice(i, i + BATCH_SIZE);
//     const prompt = `
// ${systemPrompt}

// Feedback array (batch ${i / BATCH_SIZE + 1}):
// ${JSON.stringify(batch)}
// `;

//     console.log(`🧠 Generating AI analytics for batch ${i / BATCH_SIZE + 1}...`);

//     const text = await generateWithRetry(prompt);
//     console.log("✅ AI Response:", text);

//     try {
//       const analytics = JSON.parse(text);
//       allAnalytics.push(analytics);
//     } catch (parseErr) {
//       console.error("⚠️ JSON parse error in AI response:", parseErr);
//     }
//   }

//   return allAnalytics.flat(); // flatten in case each batch returns an array
// };





const systemPrompt = `
You are an AI assistant that analyzes student meal feedbacks.
You will receive an array of feedbacks with the following fields:
- user: string
- meal: string
- Date: string (ISO format)
- overallRating: number (1-5)
- itemFeedback: object with each meal item { rating, comment, positiveTags, negativeTags }
- positiveTags: array of strings
- negativeTags: array of strings
- comment: string

Analyze all feedbacks and return a JSON object with the following structure:

{
  "summary": {
    "totalFeedbacks": number,
    "averageRating": number
  },
  "positiveFeedbacks": {
    "count": number
  },
  "negativeFeedbacks": {
    "count": number
  },
  "spammingUsers": {
    "count": number,
    "list": [array of usernames who submitted 2+ feedbacks]
  },
  "mostPositiveMeals": {
    "count": number,
    "meals": [
      {
        "name": string,
        "averageRating": number,
        "comments": [array of positive comments for this meal]
      }
    ]
  },
  "mostNegativeMeals": {
    "count": number,
    "meals": [
      {
        "name": string,
        "averageRating": number,
        "negativeComments": [array of negative comments for this meal]
      }
    ]
  },
  "sentimentDistribution": {
    "1_star": number,
    "2_star": number,
    "3_star": number,
    "4_star": number,
    "5_star": number
  },
  "mealAnalysis": [
    {
      "meal": string,
      "averageRating": number,
      "positiveComments": [array],
      "negativeComments": [array]
    }
  ],
  "aiSuggestions": {
    "goodPoints": [array],
    "badPoints": [array]
  },
  "aiSummaryText": string
}

Return **only JSON** and do not add any explanations.
`;

