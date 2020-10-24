import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeCompanyModel() {
  const companySchema = new Schema({
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
      unique: true,
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
    description: {
      type: String,
      required: true,
    },
    usersRegistered: [{ type: Schema.Types.ObjectId, ref: "User" }],
  });

  //Error handler middlewares
  const handleE11000 = (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {

      let key = Object.keys(error.keyValue)

      next(new Error(`This ${key[0]} is already in use!`));
    } else {
      next();
    }
  }

  companySchema.post('save', handleE11000)
  companySchema.post('update', handleE11000)
  companySchema.post('findOneAndUpdate', handleE11000)
  companySchema.post('insertMany', handleE11000)

  return mongoose.model("Company", companySchema);
}
