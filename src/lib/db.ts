import { MongoClient } from "mongodb";
import { requireServerEnv } from "@/lib/env";

const uri = requireServerEnv("MONGODB_URI");
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (
  process.env.NODE_ENV === "production" &&
  !uri.startsWith("mongodb+srv://") &&
  !/[?&](tls|ssl)=true\b/i.test(uri)
) {
  throw new Error("Production MongoDB connections must use TLS/SSL.");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Helper to get database connection
export async function getDb() {
  const connection = await clientPromise;
  return connection.db();
}

export default clientPromise;
