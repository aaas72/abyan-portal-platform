import 'dotenv/config';
import { MongoClient } from 'mongodb';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} مطلوب — عرّفه في ملف .env قبل تشغيل هذا السكربت`);
  }
  return value;
}

const uri = requireEnv('MONGODB_URI');

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('abyan_db');
    const collection = db.collection('districtregions');
    const docs = await collection.find({}).toArray();
    console.log("Documents in DB:", docs.length);
    console.log(JSON.stringify(docs, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

main();
