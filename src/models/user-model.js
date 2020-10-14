import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeUserModel() {
  return mongoose.model(
    "User", Schema({
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
  );
}
