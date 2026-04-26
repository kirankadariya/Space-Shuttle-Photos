const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    // Use real API key from env, fall back to NASA DEMO_KEY for testing
    const apiKEY = process.env.Api_KEY || "DEMO_KEY";

    const fetchFn = typeof fetch !== "undefined" ? fetch : require("node-fetch");

    const response = await fetchFn(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("NASA APOD API error:", data);
      throw new Error(
        data.error?.message || `NASA API returned status ${response.status}`
      );
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("apodApi handler error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = { handler };
