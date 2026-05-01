require('dotenv').config();
const mongoose = require('mongoose');

async function main(){
  try{
    const uri = process.env.MONGO_URI;
    if(!uri){
      console.error('MONGO_URI not set in environment');
      process.exit(1);
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const users = mongoose.connection.collection('users');
    const targetEmail = process.env.ADMIN_EMAIL || 'admin@email.com';
    const filter = { email: targetEmail };
    const update = { $set: { role: 'admin' } };
    const result = await users.updateOne(filter, update);
    console.log('Result:', { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Error:', err && err.message ? err.message : err);
    try{ await mongoose.disconnect(); }catch(e){}
    process.exit(2);
  }
}

main();
