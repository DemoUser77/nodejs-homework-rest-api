import express from "express";
import Joi from "joi";

import contactsService from "../../models/contacts.js";
import { HttpError } from "../../helpers/index.js";

const contactsRouter = express.Router();

const contactAddSchema = Joi.object({
  name: Joi.string().messages({
        "any.required": `"name" must be exist`,
  }),
  email: Joi.string()
   .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
   .required(),
  phone: Joi.string().required(),
})

contactsRouter.get('/', async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
  
})

contactsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, 'Not Found');
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "error.message");
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, "Not Found")
    }
    res.json({ message: "Contact Deleted"})
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.put('/:id', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing fields")
    }
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

export default contactsRouter;
