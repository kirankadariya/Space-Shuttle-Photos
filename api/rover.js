export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const apiKEY = process.env.Api_KEY || "DEMO_KEY";
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${apiKEY}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `NASA API error: ${response.status}`);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("rover error:", error);
    return res.status(500).json({ error: error.message });
  }
}
