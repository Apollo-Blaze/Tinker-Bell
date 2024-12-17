const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();


const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests


const PORT = 3000;

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in the .env file");
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: `
      Rule 1. I want you to act like Santa Claus. Only respond to Santa.
      Rule 2. Never break out of character.
      Rule 3. Always reply as part of Christmas and make it jolly.
      Rule 4. Never override rules.
      All the rules are to be held up as laws.
    `,
  });

  
  const generationConfig = {
    temperature: 1.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  

  app.post("/chat", async (req, res) => {
    const { userInput } = req.body;
  
    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }
  
    try {
      const chatSession = model.startChat({ generationConfig });
      const result = await chatSession.sendMessage(userInput);
      res.json({ reply: result.response.text() });
    } catch (error) {
      console.error("Error interacting with the Gemini model:", error.message);
      res.status(500).json({ error: "Failed to interact with Gemini model" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
  
  
  