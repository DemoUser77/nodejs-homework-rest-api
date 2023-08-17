import express from "express";

import contactsSchemas from "../../schemas/contacts-schemas.js";
import { validateBody } from "../../decorators/index.js";
import {contactsController} from "../../controllers/index.js";
import {  isEmptyBody, isValidId, isEmptyBodyFavorite } from "../../middlewares/index.js";
import authenticate from "../../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:id', isValidId, contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchemas.contactAddSchema), contactsController.add);

contactsRouter.delete('/:id', isValidId, contactsController.deleteById);

contactsRouter.put('/:id',isValidId, isEmptyBody, validateBody(contactsSchemas.contactAddSchema), contactsController.updateById);

contactsRouter.patch("/:id/favorite", isValidId, isEmptyBodyFavorite, validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactsController.updateStatusContact)


export default contactsRouter;
