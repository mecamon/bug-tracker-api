import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeSuperuserModel() {
  const superuserSchema = new Schema({
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


  //Error handler middlewares
  const handleE11000 = (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {

      let key = Object.keys(error.keyValue)

      next(new Error(`${key[0]} duplicated`));
    } else {
      next();
    }
  }

  superuserSchema.post('save', handleE11000)
  superuserSchema.post('update', handleE11000)
  superuserSchema.post('findOneAndUpdate', handleE11000)
  superuserSchema.post('insertMany', handleE11000)


  return mongoose.model("Superuser", superuserSchema);
}
