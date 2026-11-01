import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import dns from "node:dns";

// Fix for querySrv ECONNREFUSED error on local networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
