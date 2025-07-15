import axios from "axios";

export const getORSRoute = async (start, end, waypoints = []) => {
  try {
    const coordinates = [start, ...waypoints, end];

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { coordinates },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const route = response.data;
    const summary = route.features[0].properties.summary;
    const geometry = route.features[0].geometry;

    return {
      distanceInKm: (summary.distance / 1000).toFixed(2),
      durationInMin: (summary.duration / 60).toFixed(2),
      polyline: geometry.coordinates,
    };
  } catch (err) {
    console.error("ORS routing error:", err.message);
    throw new Error("Failed to get route from ORS");
  }
};
