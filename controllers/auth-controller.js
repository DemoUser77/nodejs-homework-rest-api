import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Jimp from "jimp";
import { nanoid } from "nanoid";


import User from "../models/user.js"
import { HttpError,sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL} = process.env;


const registerAvatar = async (req, res) => {  
    const { _id } = req.user;
    const { path: oldPath, originalname } = req.file;
    const avatarName = `${_id}_${originalname}`;
    const newPath = path.resolve("public", "avatars", avatarName);
    const avatarURL = path.join("avatars", avatarName);
   
    try {
        const image = await Jimp.read(oldPath);
        await image.resize(250, 250);
        await image.writeAsync(oldPath);
        await fs.rename(oldPath, newPath);
    } catch (error) {
        await fs.unlink(oldPath);
        return error;
    }
    
    const updateAvatar = await User.findByIdAndUpdate(_id, { avatarURL },{new:true});
    if (!updateAvatar) {
        throw HttpError(401, "Not authrized");
    }
    
    res.json({ avatarURL });

}

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatar = gravatar.url(email);

    const newUser = await User.create({ ...req.body, avatarURL: avatar, password: hashPassword, verificationToken});
      
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Click verify email</a>`
    }
    await sendEmail(verifyEmail);
    
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription, 
            
        }
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not Found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
        message: "Verification successful"
    });
}


const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, "User not found");
    };

    if (user.verify) {
    throw HttpError(400, "Verification has already been passed")
    };

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}" target="_blank">Click verify email</a>`
    }

    await sendEmail(verifyEmail);
    
    res.json({
        message: "Email resend"
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
    })
}

const getCurrent = (req, res) => {
    const { email, subscription } = req.user;

    res.json({email,subscription})
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json()
}

export default {
    registerAvatar: ctrlWrapper(registerAvatar),
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}