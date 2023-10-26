import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

//sign up
router.post(
  "/signUp",
  passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup",
  }),
  async (req, res) => {
    res.render("logIn", {
      message: "user created successfully",
      style: "logIn.css",
    });
  }
);
router.get("/fail-signup", (req, res) => {
  res.render("signUp", {
    error: "error creating user",
    style: "signUp.css",
  });
});

//sign up with github
router.get("/signup-github", passport.authenticate("signupGithubStrategy"));
router.get(
  config.github.callbackUrl,
  passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup",
  }),
  (req, res) => {
    res.render("profile", {
      style: "profile.css",
    });
  }
);

//log in
router.post(
  "/login",
  passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  async (req, res) => {
    res.redirect("/home", 200, { style: "home.css" });
  }
);
router.get("/fail-login", (req, res) => {
  res.render("login", {
    error: "log in error",
    style: "logIn.css",
  });
});
//log in up with github
router.get("/login-github", passport.authenticate("loginGithubStrategy"));
router.get(
  config.github.callbackUrl,
  passport.authenticate("loginGithubStrategy", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  (req, res) => {
    res.redirect("/profile", 200, { style: "profile.css" });
  }
);

//logout
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error)
        return res.render("profile", {
          error: "logout error",
          style: "profile.css",
        });
    });
    res.redirect("/", 200, { style: "logIn.css" });
  } catch (error) {
    res.render("profile", { error: "logout error", style: "profile.css" });
  }
});

export { router as sessionsRouter };
