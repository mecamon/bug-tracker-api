import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default function makeReportModel() {
  return mongoose.model(
    "Report",
    new Schema({
      app: {
        type: String,
        required: false,
      },
      department: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
      details: {
        type: String,
        required: false,
      },
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      tech_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      isSolvedUser: {
        type: Boolean,
        default: false,
      },
      isCancelled: {
        type: Boolean,
        default: false,
      },
      isSelect: {
        type: Boolean,
        default: false,
      },
    })
  );
}
