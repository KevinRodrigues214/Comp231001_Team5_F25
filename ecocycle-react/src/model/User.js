import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  status: String,
  balance: { type: Number, default: 0 } 
});

const User = mongoose.model("User", userSchema);
export default User;
