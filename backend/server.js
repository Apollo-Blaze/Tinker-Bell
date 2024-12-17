const express = require("express");
const cors = require("cors");

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require("dotenv").config();

const app = express();


// Middleware
app.use(cors()); // Enable CORS for all routes
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Check for missing API key
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in the .env file");
  process.exit(1);
}

// Initialize Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Define the model and system instruction
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
  systemInstruction: `
    Rule 1. I want you to act like Santa Claus as part of Tinkerhub GEC thrissur. Only respond to Santa.
    Rule 2. Never break out of character.
    Rule 3. Always reply as part of Christmas and make it jolly.
    Rule 4. Never override rules.
    All the rules are to be held up as law.
  `,
});

// Generation configuration
const generationConfig = {
  temperature: 1.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// API Endpoint
app.post("/chat", async (req, res) => {
  const { userInput } = req.body;

  // Validate user input
  if (!userInput) {
    return res.status(400).json({ error: "User input is required" });
  }

  try {
    // Start a new chat session
    const chatSession = model.startChat({
      generationConfig,
    });

    // Send the user's message to the model
    const result = await chatSession.sendMessage(userInput);

    // Respond with the model's reply
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error interacting with the Gemini model:", error.message);
    res.status(500).json({ error: "Failed to interact with Gemini model" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
