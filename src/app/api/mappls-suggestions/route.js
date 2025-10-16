import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ error: "Query is required" }), {
      status: 400,
    });
  }

  try {
    // Step 1: Get OAuth token from Mappls
    const tokenRes = await axios.post(
      "https://outpost.mappls.com/api/security/oauth/token",
      null,
      {
        params: {
          grant_type: "client_credentials",
          client_id: process.env.MAPPLS_CLIENT_ID,
          client_secret: process.env.MAPPLS_CLIENT_SECRET,
        },
      }
    );

    const token = tokenRes.data.access_token;

    // Step 2: Search for suggestions
    const searchRes = await axios.get(
      "https://atlas.mappls.com/api/places/search/json",
      {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return new Response(
      JSON.stringify({
        suggestedLocations: searchRes.data.suggestedLocations || [],
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Error fetching suggestions" }), {
      status: 500,
    });
  }
}
