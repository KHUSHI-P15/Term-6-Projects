require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main(){
  try{
    const uri = process.env.MONGO_URI;
    if(!uri){ console.error('MONGO_URI not set'); process.exit(1) }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const users = mongoose.connection.collection('users');
    const email = process.env.RESET_EMAIL || 'gjay49@gmail.com';
    const newPass = process.env.RESET_PASS || 'password123';
    const hash = await bcrypt.hash(newPass, 10);
    const res = await users.updateOne({ email: email }, { $set: { password: hash } });
    console.log('Result:', { matchedCount: res.matchedCount, modifiedCount: res.modifiedCount });
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error(err && err.message ? err.message : err);
    try{ await mongoose.disconnect() }catch(e){}
    process.exit(2);
  }
}

main();
