import axios from "axios";

const ORS_API_KEY = process.env.ORS_API_KEY;
export const getORSRoute = async (start, end, waypoints = []) => {
  if (!Array.isArray(start) || !Array.isArray(end)) {
    throw new Error("Start and End must be coordinate arrays [lng, lat]");
  }

  if (!ORS_API_KEY) {
    throw new Error("OpenRouteService API key is missing from environment variables");
  }

  try {
    // Snap all coordinates
    const snappedStart = await snapToRoad(start);
    const snappedEnd = await snapToRoad(end);
    const snappedWaypoints = await Promise.all(waypoints.map(snapToRoad));

    const allSnapped = [snappedStart, ...snappedWaypoints, snappedEnd];

    if (allSnapped.includes(null)) {
      throw new Error("One or more coordinates could not be snapped to a road.");
    }

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { coordinates: allSnapped },
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
