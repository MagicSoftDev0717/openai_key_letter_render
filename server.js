const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "https://www.unitedsupport508.com" }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, context } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key not set" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for a website that supports 508(c)(1)(A) trusts and online churches.",
          },
          {
            role: "user",
            content: context ? `Context: ${context}\n\nUser question: ${message}` : message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await openaiRes.json();
    res.json(data);
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to fetch OpenAI response" });
  }
});

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
