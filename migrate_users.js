const mongoose = require("mongoose");

const uri = "mongodb+srv://Hunar9108:Chaurasia1203@cluster0.35qcigu.mongodb.net/BlogWebsite?appName=Cluster0"; // MONGO_URI from .env

async function migrate() {
  await mongoose.connect(uri);

  const usersettings = mongoose.connection.collection("usersettings");
  const users = mongoose.connection.collection("users");

  // Fetch all documents from usersettings
  const allUserSettings = await usersettings.find({}).toArray();

  if (allUserSettings.length === 0) {
    console.log("No documents found in usersettings.");
    return;
  }

  // Insert them into users
  await users.insertMany(allUserSettings);

  console.log(`Migrated ${allUserSettings.length} users to 'users' collection.`);

  // Optional: Drop the usersettings collection
  // await usersettings.drop();
  // console.log("Dropped 'usersettings' collection.");

  mongoose.connection.close();
}

migrate().catch(console.error);
