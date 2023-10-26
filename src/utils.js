import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = "coderSecretToken";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//generar hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
//comparar passwords
export const isValidPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  const token = jwt.sign({ name: user.name, email: user.email }, PRIVATE_KEY, {
    expiresIn: "24h",
  });
  return token;
};
