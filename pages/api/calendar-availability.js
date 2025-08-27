export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwvqxdEp4sWhAACzZRlPe9LzNdNxg2lY5XvIh_uRcfWJHMTnKlFaetKAdwSPdiGzTtwDg/exec";

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const response = await fetch(`${GAS_URL}?action=availability`);
const text = await response.text();

try {
  const data = JSON.parse(text); // 明示的にJSONとしてパース
  return res.status(200).json(data);
} catch (err) {
  console.error("JSONパース失敗:", text); // ログに中身を出す
  return res.status(500).json({ message: "JSONパース失敗", raw: text });
}