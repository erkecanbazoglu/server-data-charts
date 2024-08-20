import axios from "axios";
import dataSchema from "../schemas/dataSchema";

const port = import.meta.env.VITE_SERVER_PORT;

// Base URL for the backend
const BASE_URL = `http://localhost:${port}`;

// Function to fetch data from backend
export const getData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/data`);

    // validating the result
    const validatedResult = dataSchema.validateSync(response.data);

    return validatedResult;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
