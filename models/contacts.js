
// import fs from "fs/promises";
// import path from "path";
// import { nanoid } from "nanoid";

// const contactsPath = path.resolve("models", "contacts.json");
 
// const updateContacts = contact => fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));

// //  Повертає масив контактів.
// export const listContacts = async()=> {
//     const data = await fs.readFile(contactsPath);
//     return JSON.parse(data);
// }

//  //Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
// export  const getContactById = async(id) =>{
//  const contact = await listContacts();
//  const result = contact.find(item => item.id === id);
//  return result || null;
// }
 
// //Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
// export const removeContact = async (id) => {
//   const contact = await listContacts();
//   const index = contact.findIndex(item => item.id === id);
//   if (index === -1) {
//     return null;
//   }
//    const [result] = contact.splice(index, 1);
//     await updateContacts(contact);
//     return result;
// }
 
// //Повертає об'єкт доданого контакту. 
// export const addContact = async ({ name, email, phone })=> {
//   const contact = await listContacts();
//   const newContact = {
//     id: nanoid(),
//     name,
//     email,
//     phone,
//   }
//   contact.push(newContact);
//   await updateContacts(contact);
//   return newContact;
// }

// export const updateContact = async (id, { name, email, phone }) => {
//   const contact = await listContacts();
//   const index = contact.findIndex(item => item.id === id);
//   if (index === -1) {
//     return null;
//   }
//   contact[index] = { id, name, email, phone };
//   await updateContacts(contact);
//   return contact[index];
// }

// export default {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };

