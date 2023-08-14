import Jimp from "jimp";
import { HttpError } from "../helpers/index.js";

const resizeAvatar = async (req, res, next) => {
   try{
    const { path } = req.file;

    if (!path) {
        throw HttpError(401, "Not authorized");
    }

        const image = await Jimp.read(path);
        await image.resize(250, 250).write(path);
        next();
    } catch (error) {
        next(error);
    }
}
export default resizeAvatar;