import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/user.js"
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const registerAvatar = async (req, res) => {  
    const { _id, avatarURL: oldAvatar } = req.user;
    const { path: oldPath, filename } = req.file;

    const avatarName = `${_id}_${filename}`;
    const newPath = path.join(avatarPath, avatarName);
        await fs.rename(oldPath, newPath);

    const avatarURL = path.join("avatars", avatarName);
    const updateAvatar =  await User.findByIdAndUpdate(_id, { avatarURL},{new:true,});
    if (!updateAvatar) {
        throw HttpError(404, 'Not found');
    }
      
    if (oldAvatar ) {
        const filenamePath = path.resolve("public", oldAvatar );
        try {
            await fs.unlink(filenamePath);
        } catch (error) {
             throw HttpError(404,'Not found')
        }
    }
    res.json({avatarURL});
    
}


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);

    const newUser = await User.create({ ...req.body, avatarURL: avatar, password: hashPassword });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription, 
            
        }
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
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
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}