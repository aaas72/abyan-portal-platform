const mongoose = require('mongoose');
require('dotenv').config();

async function fixRegions() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  const result = await db.collection('districts').updateMany(
    { region: 'yafaa' },
    { $set: { region: 'yafa' } }
  );
  
  console.log(`Matched ${result.matchedCount}, Modified ${result.modifiedCount}`);
  
  await mongoose.disconnect();
}

fixRegions().catch(console.error);
