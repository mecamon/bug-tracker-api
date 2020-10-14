import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeCompanyModel() {
  const companySchema = Schema({
    name: {
      type: String,
      required: true,
    },
    rnc: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telephone: {
      type: Number,
      required: true,
    },
    usersPaid: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dateExp: {
      type: Date,
      required: true,
    },
    usersRegistered: [{ type: Schema.Types.ObjectId, ref: "User" }],
  });
  return mongoose.model("Company", companySchema);
}
