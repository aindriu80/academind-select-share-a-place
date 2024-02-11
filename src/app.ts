import dotenv from "dotenv";
dotenv.config();
import mapboxgl from "mapbox-gl";

// Set Mapbox access token// Set Mapbox access token if it's defined
if (process.env.MAP_BOX_API_KEY) {
  mapboxgl.accessToken = process.env.MAP_BOX_API_KEY;
} else {
  console.error(
    "Mapbox API key is not defined. Make sure to set it in your environment variables.",
  );
}

// Create a map instance
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-21.92661562, 64.14356426], // Default center
  zoom: 13,
});

// Function to geocode the address using Mapbox Geocoding API
async function geocode(address: string): Promise<{ lng: number; lat: number }> {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`,
  );
  const data = await response.json();
  const [lng, lat] = data.features[0].center;
  return { lng, lat };
}
// Event listener for form submission
document
  .getElementById("addressForm")!
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const addressInput = document.getElementById("address") as HTMLInputElement;
    const address = addressInput.value;
    const { lng, lat } = await geocode(address);
    map.setCenter([lng, lat]);
  });
