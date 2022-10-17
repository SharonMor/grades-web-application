import { MongoClient } from "mongodb";

let db;

async function connectToDb(callback) {
  const client = new MongoClient(
    `mongodb+srv://node-server:${process.env.MONGO_PASSWORD}@cluster0.fn51mpp.mongodb.net/?retryWrites=true&w=majority`
  );
  await client.connect();
  db = client.db("grades-db");
  callback();
}

export { db, connectToDb };
