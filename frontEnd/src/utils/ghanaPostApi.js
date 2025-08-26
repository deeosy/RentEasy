import axios from "axios";

const API_BASE_URL = 'https://ghanapostgps.sperixlabs.org';

// fetch coordinates from digital address

export async function fetchLocationFromAddress(address) {
  try {
    const response = await axios.post(`${API_BASE_URL}/get-location`, new URLSearchParams({ address }),
    { 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }    
    }
  ); 

  const data = response.data;
  console.log(data);

  if (data.found && data.data?.Table?.[0]){
    const location = data.data.Table[0];

    console.log(location);    

    return {
      latitude: location.CenterLatitude,
      longitude: location.CenterLongitude
    };
  } else {
    throw new Error("No coordinates found for this address");    
  }
  } catch (error) {
    console.error("API error:", error);
    if (error.response?.status === 400) {
      throw new Error("Invalid digital address. Please check the format (e.g. GA-123-4567).");      
    }
    throw new Error("Failed to fetch coordinates. Please try again or use current location.");
    
  }
} 