const express = require("express");
const router = express.Router({ mergeParams: true });
const path = require("path");
router.use(express.static(path.join(__dirname, "/public")));
router.use(express.urlencoded({ extended: true }));
const wrapAsc = require("../utils/wrapAsc.js");
const middleware=require("../middleware.js");
const reviewControllers=require("../controllers/reviewControllers.js");


router.get("/:reviewId",middleware.isLoggedIn, middleware.isAuthor,wrapAsc(reviewControllers.distroyReview));

router.post("/",middleware.isLoggedIn, middleware.validateReview, wrapAsc(reviewControllers.createReview))

module.exports = router;
