import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeSuperuserModel() {
  const superuserSchema = Schema({
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birth: {
      type: Date,
      required: true,
    },
  });
  return mongoose.model("Superuser", superuserSchema);
}
