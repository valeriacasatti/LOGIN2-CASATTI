import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//generar hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
//comparar passwords
export const isValidPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};
