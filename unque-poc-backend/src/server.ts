import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { verifyWebHook } from "./controller/veriftyWebHook";
import "dotenv/config";
import fetchLead from "./controller/fetchLead";
import { dbConnect } from "./db";
import { getLeadsDB } from "./controller/getLeadsDB";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

// Socket IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Logs to test connection each time
io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

// GET Request to verify Webhook thorugh Meta App Dashboard
app.get("/webhooks", verifyWebHook);

// POST Request to handle the incoming new lead
app.post("/webhooks", fetchLead, (req, res) => {
  const lead = req.body;
  // Socket event emitted sends the new lead
  io.emit("new_lead", { lead });
  res.status(200).send({ message: "Recieved New Lead" });
});

// Fetch saved lead list from DB
app.get("/leads", getLeadsDB);

// Server Starts
dbConnect().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
