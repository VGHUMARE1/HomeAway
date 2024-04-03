const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware.js");
const userControllers = require("../controllers/userControllers.js");

router.get("/logout", userControllers.logout);

router.route("/signin")
    .get(userControllers.renderSigninForm)
    .post(userControllers.signin);

router.route("/login")
    .get(userControllers.renderloginForm)
    .post(middleware.redirecturl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), userControllers.login);


module.exports = router;