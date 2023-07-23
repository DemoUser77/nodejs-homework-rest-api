import express from "express";

import contactsSchemas from "../../schemas/contacts-schemas.js";
import { validateBody } from "../../decorators/index.js";
import {contactsController} from "../../controllers/index.js";
import { isEmptyBody } from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:id', contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchemas.contactAddSchema), contactsController.add);

contactsRouter.delete('/:id', contactsController.deleteById);

contactsRouter.put('/:id', isEmptyBody, validateBody(contactsSchemas.contactAddSchema), contactsController.updateById);

export default contactsRouter;
