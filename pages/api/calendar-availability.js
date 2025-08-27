export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwvqxdEp4sWhAACzZRlPe9LzNdNxg2lY5XvIh_uRcfWJHMTnKlFaetKAdwSPdiGzTtwDg/exec";

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const response = await fetch(`${GAS_URL}?action=availability`);
    const data = await response.json(); // 直接JSONとしてパース
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "取得エラー", error: err.message });
  }
}