// src/app/api/mappls-coords/route.js
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eloc = searchParams.get("eloc");

    if (!eloc) {
      return new Response(JSON.stringify({ error: "Missing eLoc" }), {
        status: 400,
      });
    }

    const res = await axios.get(
      `https://apis.mappls.com/advancedmaps/v1/${process.env.MAPPLS_REST_API_KEY}/place_detail`,
      { params: { eloc } }
    );

    if (res.data && res.data.latitude && res.data.longitude) {
      return new Response(
        JSON.stringify({
          lat: res.data.latitude,
          lon: res.data.longitude,
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ error: "No coordinates found" }), {
      status: 404,
    });
  } catch (err) {
    console.error("Error fetching coords:", err?.response?.data || err.message);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
