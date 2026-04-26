const https = require("https");

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          reject(new Error("Failed to parse NASA response: " + raw.slice(0, 200)));
        }
      });
    }).on("error", reject);
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const apiKEY = process.env.Api_KEY || "DEMO_KEY";
    const date = (req.query && req.query.date) || new Date().toISOString().slice(0, 10);

    const { status, data } = await httpsGet(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${apiKEY}`
    );

    if (status !== 200) {
      return res.status(status).json({
        error: data.error?.message || data.msg || `NASA returned status ${status}`,
        nasa_response: data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("rover error:", error);
    return res.status(500).json({ error: error.message });
  }
}
