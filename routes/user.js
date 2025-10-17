const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport"); 

//SignUp Routes.
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email: email,
        username: username,
      });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);
//Login Routes.
router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

router.post(
  "/login",
  //First Authenticate the user using passport.
  passport.authenticate(
    "local",
    { failureRedirect: "/login", failureFlash: true} 
  ),
  //Execute this call back if authentication succeeded.
  async (req, res) => {
     req.flash("success","Welcome back to Wanderlust!");
     res.redirect("/listings");
  }
);
module.exports = router;
