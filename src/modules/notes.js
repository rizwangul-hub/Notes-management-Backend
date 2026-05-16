import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);


export const Notes = mongoose.model("Notes", notesSchema);
