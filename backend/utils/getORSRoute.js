import axios from "axios";

const ORS_API_KEY = process.env.ORS_API_KEY;

export const getORSRoute = async (start, end, waypoints = []) => {
  if (!Array.isArray(start) || !Array.isArray(end)) {
    throw new Error("Start and End must be coordinate arrays [lng, lat]");
  }

  if (!ORS_API_KEY) {
    throw new Error("OpenRouteService API key is missing");
  }

  try {
    const allCoordinates = [start, ...waypoints, end];

    // The 'radiuses' parameter tells ORS to snap each point.
    // -1 means an unlimited search radius for the nearest road.
    const body = {
      coordinates: allCoordinates,
      radiuses: allCoordinates.map(() => -1) 
    };

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      body, // Use the new body with coordinates and radiuses
      {
        headers: {
          Authorization: ORS_API_KEY,
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