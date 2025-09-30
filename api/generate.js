// api/generate.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, image } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // dari Vercel Environment Variables
    });

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "512x768",
      n: 1,
      image: image ? [image] : undefined, // optional: kalau ada foto anak
    });

    return res.status(200).json({ url: response.data[0].url });
  } catch (err) {
    console.error("Error generate:", err);
    return res.status(500).json({ error: "Failed to generate image" });
  }
}
