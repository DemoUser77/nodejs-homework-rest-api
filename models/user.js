import { Schema, model } from "mongoose";

import { handleSaveError, handleUpdateValidate } from "./hooks.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema({
  email: {
    type: String,
    match: emailRegexp,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    required: [true, 'Set password for user'],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
  },
  avatarURL: {
    type: String,
  },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    }
},{ versionKey: false, timestamps: true });

userSchema.pre("findOneAndUpdate", handleUpdateValidate);
userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;