import axios from "axios";

export const geocodeAddress = async (address) => {
  if (!address || typeof address !== "string") {
    throw new Error("Invalid address input");
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouteService API key is missing in environment variables");
  }

  const url = "https://api.openrouteservice.org/geocode/search";

  try {
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
        text: address,
        size: 1,
      },
    });

    const features = response.data?.features || [];

    if (!features.length) {
      throw new Error(`No results found for address: "${address}"`);
    }

    const location = features[0];

    return {
      coordinates: location.geometry.coordinates,  
      label: location.properties.label,
      country: location.properties.country,
      city: location.properties.locality || null,
      region: location.properties.region || null,
    };
  } catch (error) {
    console.error("Geocoding error:", error.message || error);
    throw new Error("Failed to geocode address. Please check the address format or try again.");
  }
};
