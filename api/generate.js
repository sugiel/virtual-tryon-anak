// api/generate.js
export default async function handler(req, res) {
  // allow CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // baca body (Next.js/autoparsing biasanya bekerja untuk JSON)
    const body = req.body || {};
    // jika body kosong, tangani juga
    const prompt = body.prompt || body.image || 'demo';

    // Untuk debug: kembalikan gambar placeholder agar frontend bisa tampilkan hasil
    return res.status(200).json({
      url: 'https://via.placeholder.com/512x768.png?text=Demo+AI+Image'
    });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
