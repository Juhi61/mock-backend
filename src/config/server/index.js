import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import routes from "../../routes/index.js";
import config from "../../config/env/index.js";
import { dbConnect } from "../database/dbConnect.js";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.app.corsOrigin,
    credentials: true,
  }),
);

// Routes
app.use("/version", (req, res) => {
  res.send({ version: "1.0.0" });
});
app.use("/api", routes);

// Start server
const server = createServer(app);
server.listen(config.app.port, async () => {
  console.log(`Server Running on ${config.app.port}`);
  await dbConnect();
});

export default server;
