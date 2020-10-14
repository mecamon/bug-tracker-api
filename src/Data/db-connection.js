import mongoose from "mongoose";
require("dotenv").config();

export default async function dbConnection() {
  const db = await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    retryWrites: false
  });
  if(db) console.log("Connected to DB...")
}
