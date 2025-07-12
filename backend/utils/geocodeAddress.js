import axios from "axios";

export const geocodeAddress = async (address) => {
  const apiKey = process.env.ORS_API_KEY;

  const url = `https://api.openrouteservice.org/geocode/search`;

  try {
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
        text: address,
        size: 1,
      },
    });

    const features = response.data.features;

    if (!features.length) {
      throw new Error("Location not found");
    }

    // Coordinates format: [longitude, latitude]
    return features[0].geometry.coordinates;
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw new Error("Failed to geocode address");
  }
};
