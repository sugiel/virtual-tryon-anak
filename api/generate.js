// File: api/generate.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, image } = req.body;

    if (!prompt || !image) {
      return res.status(400).json({ error: "Prompt dan image harus ada." });
    }

    // Ambil API Key dari Vercel Environment Variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key belum diatur." });
    }

    // Panggil API OpenAI Images Edit
    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: (() => {
        const formData = new FormData();
        formData.append("image", base64ToFile(image, "upload.png"));
        formData.append("prompt", prompt);
        formData.append("size", "512x512");
        return formData;
      })()
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ url: data.data[0].url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper: convert base64 → File (supaya bisa dikirim ke OpenAI)
function base64ToFile(base64, filename) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = Buffer.from(arr[1], "base64");
  return new File([bstr], filename, { type: mime });
}
