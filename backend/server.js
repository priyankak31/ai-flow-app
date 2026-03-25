const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: [
    "http://localhost:3000",                        
    "https://ai-flow-app-frontend2.onrender.com/"         
  ]
}));
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const conversationSchema = new mongoose.Schema({
  prompt: String,       
  response: String,     
  savedAt: {
    type: Date,
    default: Date.now,  
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);


app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt cannot be empty." });
  }

  try {
    console.log(`📨 Received prompt: "${prompt}"`);

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await openRouterResponse.json();

    if (data.error) {
      console.error("OpenRouter error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const aiResponse = data.choices[0].message.content;
    console.log(`🤖 AI Response: "${aiResponse.substring(0, 50)}..."`);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});


app.post("/api/save", async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res
      .status(400)
      .json({ error: "Both prompt and response are required to save." });
  }

  try {
    const newConversation = new Conversation({ prompt, response });
    await newConversation.save();

    console.log("💾 Conversation saved to MongoDB!");
    res.json({ message: "Saved successfully!" });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save to database." });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ savedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
