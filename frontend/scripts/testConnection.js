const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/busbooking');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/busbooking');
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const { databases } = await adminDb.listDatabases();
    
    console.log('\n📊 Available databases:');
    databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Check if busbooking database exists
    const dbExists = databases.some(db => db.name === 'busbooking');
    if (dbExists) {
      console.log('\n✅ busbooking database exists!');
      
      // List collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\n📁 Collections in busbooking:');
      if (collections.length > 0) {
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
      } else {
        console.log('  (No collections yet - run seed script to create buses)');
      }
    } else {
      console.log('\nℹ️  busbooking database will be created on first use');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('  1. Make sure MongoDB service is running');
    console.log('  2. Check if MongoDB is running on port 27017');
    console.log('  3. Verify your MONGODB_URI in .env file');
    console.log('  4. Try: mongodb://localhost:27017/busbooking');
    process.exit(1);
  }
};

testConnection();

