import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
       minLength: [6, 'Username must be at least 6 characters long']
      
    },
    
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);