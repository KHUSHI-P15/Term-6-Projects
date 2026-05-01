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
    const docs = await users.find({}, { projection: { email: 1, role: 1, name: 1 } }).limit(20).toArray();
    console.log('Users:');
    docs.forEach(u => console.log('-', u.email, '|', u.role || 'user', '|', u.name || ''));
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Error listing users:', err && err.message ? err.message : err);
    try{ await mongoose.disconnect(); }catch(e){}
    process.exit(2);
  }
}

main();
