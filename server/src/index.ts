import express, { Response } from "express";
import cors from "cors";
import dataRoutes from "./routes/dataRoutes.js";
import { setupScheduledJobs } from "./jobs/fetchData.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;

// Start the server
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (_, res: Response) => {
  res.send("Hello, world!");
});

// Register the routes
app.use("/api", dataRoutes);

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Emit updated data to all clients after each fetch
export const broadcastData = (data: any) => {
  io.emit("dataUpdate", data);
};

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Start the scheduled job
setupScheduledJobs(broadcastData);
