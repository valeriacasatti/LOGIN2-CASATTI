import passport from "passport";
import localStrategy from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { usersService } from "../dao/index.js";

export const initializePassport = () => {
  //signup
  passport.use(
    "signupLocalStrategy",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { name, lastame } = req.body;
        try {
          const user = await usersService.getUser({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            name,
            lastame,
            email: username,
            password: createHash(password),
          };
          const userCreated = await usersService.addUser(newUser);

          return done(null, userCreated);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //log in
  passport.use(
    "loginLocalStrategy",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await usersService.getUser({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(password, user)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await usersService.getUserById(id);
    done(null, user);
  });
};
