import axios from "axios";

export const getORSRoute = async (start, end, waypoints = []) => {
  if (!Array.isArray(start) || !Array.isArray(end)) {
    throw new Error("Start and End must be coordinate arrays [lng, lat]");
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouteService API key is missing from environment variables");
  }

  const coordinates = [start, ...waypoints, end];

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { coordinates },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const route = response.data;
    const firstFeature = route?.features?.[0];

    if (!firstFeature) {
      throw new Error("No route found from ORS");
    }

    const summary = firstFeature.properties?.summary;
    const geometry = firstFeature.geometry;

    return {
      distanceInKm: (summary?.distance / 1000).toFixed(2),
      durationInMin: (summary?.duration / 60).toFixed(2),
      polyline: geometry?.coordinates || [],
    };
  } catch (err) {
    console.error("ORS routing error:", err?.response?.data || err.message);
    throw new Error("Failed to retrieve route data from ORS API");
  }
};
