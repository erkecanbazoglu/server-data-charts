import axios from "axios";
import cron from "node-cron";
import { getDB, writeDB } from "../config/db.js";

const regions = [
  { name: "us-east", url: "https://data--us-east.upscope.io/status?stats=1" },
  { name: "eu-west", url: "https://data--eu-west.upscope.io/status?stats=1" },
  {
    name: "eu-central",
    url: "https://data--eu-central.upscope.io/status?stats=1",
  },
  { name: "us-west", url: "https://data--us-west.upscope.io/status?stats=1" },
  { name: "sa-east", url: "https://data--sa-east.upscope.io/status?stats=1" },
  {
    name: "ap-southeast",
    url: "https://data--ap-southeast.upscope.io/status?stats=1",
  },
];

// Function to fetch and store data
export const fetchData = async (broadcastDataCallback: any) => {
  const db = getDB();

  const promises = regions.map(async (region) => {
    try {
      const response = await axios.get(region.url);
      return {
        region: region.name,
        data: response.data,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching data for ${region.name}:`, error);
      return {
        region: region.name,
        data: null,
        timestamp: new Date(),
        error: true,
      };
    }
  });

  const results = await Promise.all(promises);
  db.data!.data.push(...results);
  await writeDB();

  // Emit the new data to all clients
  broadcastDataCallback(results);
};

// Schedule the job to run every minute
export const setupScheduledJobs = (broadcastDataCallback: any) => {
  cron.schedule("* * * * *", async () => {
    console.log("Fetching data...");
    await fetchData(broadcastDataCallback);
  });
};
