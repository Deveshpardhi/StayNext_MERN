const express        = require("express");
const router         =  express.Router({mergeParams : true});
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup",userController.signUp);

router.post("/signup",wrapAsync(userController.signUpPost));

router.get("/login",userController.login);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
}),
   userController.loginPost
);

router.get("/logout",userController.logOut);

module.exports =router;
// 