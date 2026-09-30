import { MongoClient } from "mongodb";

// Support both the Emergent local template (MONGO_URL) and Vercel (MONGODB_URI).
const uri = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!uri) {
  throw new Error("Missing MongoDB connection string (MONGODB_URI or MONGO_URL)");
}

const options = { maxPoolSize: 10 };

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Reuse the connection across hot reloads in development.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export function getDb(connectedClient) {
  const dbName = process.env.DB_NAME || process.env.MONGODB_DB || "sstraining_school";
  return connectedClient.db(dbName);
}

export default clientPromise;
