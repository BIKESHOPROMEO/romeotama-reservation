export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/あなたのGASデプロイURL/exec";

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const response = await fetch(`${GAS_URL}?action=availability`);
    const text = await response.text();
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "取得エラー", error: err.message });
  }
}