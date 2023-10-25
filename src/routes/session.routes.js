import { Router } from "express";
import { usersService } from "../dao/index.js";
import passport from "passport";

const router = Router();

//sign up
router.post(
  "/signUp",
  passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/session/fail-signup",
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

//log in
router.post(
  "/login",
  passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/session/fail-login",
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

export { router as sessionRouter };
