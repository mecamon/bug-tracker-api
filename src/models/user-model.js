import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeUserModel() {

  const userSchema = new Schema({
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
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    gender: {
      type: String,
      required: true,
    },
    birth: {
      type: Date,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },
    isTech: {
      type: Boolean,
      default: false,
    },
    isSupervisor: {
      type: Boolean,
      default: false,
    },
    idCompany: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    }
  })

  //Error handler middlewares
  const handleE11000 = (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {

      let key = Object.keys(error.keyValue)

      next(new Error(`${key[0]} is already in use!`));
    } else {
      next();
    }
  }

  userSchema.post('save', handleE11000)
  userSchema.post('update', handleE11000)
  userSchema.post('findOneAndUpdate', handleE11000)
  userSchema.post('insertMany', handleE11000)


  return mongoose.model("User", userSchema);
}
