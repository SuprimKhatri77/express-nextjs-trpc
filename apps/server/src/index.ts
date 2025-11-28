import { db } from "./db/index";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../../packages/api/src/index";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";
import { createContextFactory } from "../../../packages/api/src/context";
import { connectRedis, disconnectRedis } from "../../../packages/redis/src";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL!],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

const createContext = createContextFactory({
  db,
  auth,
  fromNodeHeaders,
});
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = process.env.PORT || 5000;

// Start server function
async function startServer() {
  try {
    // Connect to Redis BEFORE starting server
    console.log("🔄 Connecting to Redis...");
    await connectRedis();

    // ... your other server setup (tRPC, middleware, etc.)

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown - disconnect Redis when server stops
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await disconnectRedis();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down server...");
  await disconnectRedis();
  process.exit(0);
});

// Start the server
startServer();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
});
