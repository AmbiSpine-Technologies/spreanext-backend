import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    mobileNo: { type: String, required: false, unique: true, sparse: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    mobileVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    isPremium: { type: Boolean, default: false } // Premium membership status
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
