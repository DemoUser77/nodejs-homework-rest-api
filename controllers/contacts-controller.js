
import contactsService from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res, next) => {
    const result = await contactsService.listContacts();
    res.json(result);
}

const getById = async (req, res, next) => {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, 'Not Found');
    }
    res.json(result);
}

const add = async (req, res, next) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
}

const deleteById =  async (req, res, next) => {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, "Not Found")
    }
    res.json({ message: "Contact Deleted"})
}

const updateById = async (req, res, next) => {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json(result);
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
}
