import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(5).required(),
})

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(5).required(),
})

const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})
export default {
    userRegisterSchema,
    userLoginSchema,
    userEmailSchema,
};