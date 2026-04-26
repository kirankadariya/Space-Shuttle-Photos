export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const apiKEY = process.env.Api_KEY || "DEMO_KEY";
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKEY}`
    );

    // Read raw text first — NASA sometimes returns HTML on errors
    const text = await response.text();

    // If it starts with '<', NASA returned an HTML error page
    if (text.trimStart().startsWith("<")) {
      return res.status(429).json({
        error: "NASA API rate limit exceeded. Please add your own API key at api.nasa.gov or wait an hour."
      });
    }

    const data = JSON.parse(text);

    if (!response.ok || data.error) {
      return res.status(response.status || 500).json({
        error: data.error?.message || data.msg || `NASA API error: ${response.status}`
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("apod error:", error);
    return res.status(500).json({ error: error.message });
  }
}
