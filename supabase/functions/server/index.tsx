import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a8849dc2/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all coffee app data
app.get("/make-server-a8849dc2/coffee/data", async (c) => {
  try {
    const members = await kv.get("coffee:members") || [];
    const history = await kv.get("coffee:history") || [];
    const drawnInRound = await kv.get("coffee:drawnInRound") || [];

    return c.json({ members, history, drawnInRound });
  } catch (error) {
    console.error("Error fetching coffee data:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save members
app.post("/make-server-a8849dc2/coffee/members", async (c) => {
  try {
    const { members } = await c.req.json();
    await kv.set("coffee:members", members);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving members:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save history
app.post("/make-server-a8849dc2/coffee/history", async (c) => {
  try {
    const { history } = await c.req.json();
    await kv.set("coffee:history", history);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving history:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save drawn in round
app.post("/make-server-a8849dc2/coffee/drawn", async (c) => {
  try {
    const { drawnInRound } = await c.req.json();
    await kv.set("coffee:drawnInRound", drawnInRound);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving drawn in round:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Clear all data
app.delete("/make-server-a8849dc2/coffee/data", async (c) => {
  try {
    await kv.mdel(["coffee:members", "coffee:history", "coffee:drawnInRound"]);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error clearing data:", error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);