import fs from "fs";
import path from "path";
import { askGemini } from "../services/aiService.js";

export async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const base64Image = await fs.promises.readFile(req.file.path, "base64");

    const promptText = `You are a professional PC hardware assistant. ...[rest of your prompt here]...`;

    const modelResponse = await askGemini({
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "text/plain", data: Buffer.from(promptText).toString("base64") } },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          ],
        },
      ],
    });

    const description = modelResponse;
    
    // Tags generation
    const tagPrompt = `Extract 5-10 useful search tags from this description:\n${description}\nReturn only tags, comma separated.`;
    const tagText = await askGemini(tagPrompt);
    const tags = tagText.split(",").map(t => t.trim().toLowerCase());

    // Metadata extraction
    const jsonPrompt = `Parse the following structured description into a JSON object:\n${description}`;
    let metadata = {};
    try {
      const jsonOutput = await askGemini(jsonPrompt);
      metadata = JSON.parse(jsonOutput);
    } catch (e) {
      metadata = { fallback: description };
    }

    res.json({ description, tags, metadata });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: error.message });
  }
}
