import 'dotenv/config';
import * as fs from 'fs';
import { MongoClient } from 'mongodb';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} مطلوب — عرّفه في ملف .env قبل تشغيل هذا السكربت`);
  }
  return value;
}

const uri = requireEnv('MONGODB_URI');
const csvPath = process.env.IMPORT_CSV_PATH ?? 'a:\\projects\\Abyan\\.agents\\gemini-code-1786193125572.txt';

const districtAreas = {
  'خنفر': '2199', // Approximation
  'لودر': '1200'  // Approximation
};

async function main() {
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.trim().split('\n');
  
  const districtsMap = new Map();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    const district = parts[0];
    const village = parts[2];
    const populationStr = parts[3];
    const population = parseInt(populationStr, 10) || 0;

    if (!districtsMap.has(district)) {
      districtsMap.set(district, {
        name: district,
        areaKm2: districtAreas[district] || '',
        villages: [],
        population: 0,
        // Added required empty string fields so the frontend doesn't break
        title: 'مديرية ' + district,
        region: 'coastal',
        regionLabel: 'محافظة أبين',
        capital: district,
        areaPercentage: '10%',
        description: 'معلومات عن مديرية ' + district,
        geography: 'تضاريس ' + district,
        crops: [],
        landmarks: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const data = districtsMap.get(district);
    data.villages.push(village);
    data.population += population;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('abyan_db');
    const collection = db.collection('districts');

    for (const [name, data] of districtsMap.entries()) {
      // Convert population back to string as per schema
      data.population = data.population.toString();
      
      const result = await collection.updateOne(
        { name: name },
        { $set: data },
        { upsert: true }
      );
      console.log(`Upserted district: ${name}, Villages count: ${data.villages.length}, Total Population: ${data.population}`);
    }
    console.log("تم إضافة البيانات للقاعدة بنجاح!");
  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await client.close();
  }
}

main();
