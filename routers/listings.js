const express = require("express");
const router = express.Router({ mergeParams: true });
router.use(express.urlencoded({ extended: true }));
const wrapAsc = require("../utils/wrapAsc.js");
const flash = require("connect-flash");
const middleware = require("../middleware.js");
router.use(flash())
const {storage}=require("../storageConfig.js");
const multer  = require('multer')
const upload = multer({ storage:storage });
const listingControllers=require("../controllers/listingControllers.js");

router.get("/", wrapAsc(listingControllers.index));

//add route
router.route("/new")
.get( middleware.isLoggedIn, wrapAsc(listingControllers.renderNewListingForm))
.post( middleware.isLoggedIn,upload.single('image'), middleware.validateListing, wrapAsc(listingControllers.createNewListing));

// show route
router.get("/:id", middleware.isLoggedIn,wrapAsc(listingControllers.showListing ));

// app.post("/listing/:id")

// edit route
router.route("/:id/edit")
.get( middleware.isOwner, middleware.isLoggedIn, wrapAsc(listingControllers.renderEditForm))
.post( middleware.isOwner, middleware.isLoggedIn,upload.single('image'), middleware.validateListing, wrapAsc(listingControllers.editListing))

//detete route
router.get("/:id/delete", middleware.isOwner, middleware.isLoggedIn, wrapAsc(listingControllers.deleteListing));


module.exports = router;