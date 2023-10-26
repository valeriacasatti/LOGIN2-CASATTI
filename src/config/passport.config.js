import passport from "passport";
import localStrategy from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { usersService } from "../dao/index.js";
import { config } from "./config.js";
import GithubStrategy from "passport-github2";

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

  //signup with github
  passport.use(
    "signupGithubStrategy",
    new GithubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await usersService.getUser({
            email: profile._json.email,
          });
          if (user) {
            return done(null, user);
          }
          const newUser = {
            name: profile._json.name,
            email: profile._json.email,
            password: createHash(profile.id),
          };
          console.log(newUser);
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

  //login with github
  passport.use(
    "loginGithubStrategy",
    new GithubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`,
      },
      async (profile, done) => {
        try {
          const user = await usersService.getUser({
            email: profile._json.email,
          });
          if (!user) {
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
