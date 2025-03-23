// routes/PreBuildAI.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Google Generative AI or your custom AI model
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// POST route to handle AI prompts for component recommendations
router.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // You can format the response text to extract the components
        // Assuming AI response is structured like:
        // "CPU: Intel i9 10900K, GPU: NVIDIA RTX 3080, RAM: 16GB Corsair Vengeance, ..."
        const components = parseComponents(responseText);

        res.json({ components });
    } catch (error) {
        console.error("Error generating component recommendations:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

// Function to parse AI-generated response into component data
const parseComponents = (responseText) => {
    const components = {};
    const lines = responseText.split("\n");

    lines.forEach((line) => {
        if (line.startsWith("CPU:")) {
            components.CPU = line.substring(5).trim();
        } else if (line.startsWith("GPU:")) {
            components.GPU = line.substring(5).trim();
        } else if (line.startsWith("RAM:")) {
            components.RAM = line.substring(5).trim();
        } else if (line.startsWith("Storage:")) {
            components.Storage = line.substring(9).trim();
        } else if (line.startsWith("PSU:")) {
            components.PSU = line.substring(5).trim();
        }
    });

    return components;
};

export default router;  // Export as default
