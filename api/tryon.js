import OpenAI from "openai";
import fs from "fs";
import formidable from "formidable-serverless";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Form parse error" });

      const prompt = fields.prompt;
      const filePath = files.photo.filepath;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await client.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "512x768",
        image: fs.createReadStream(filePath),
      });

      res.status(200).json({ url: response.data[0].url });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
