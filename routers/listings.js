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
router.route("/listing/new")
.get( middleware.isLoggedIn, wrapAsc(listingControllers.renderNewListingForm))
.post( middleware.isLoggedIn,upload.single('image'), middleware.validateListing, wrapAsc(listingControllers.createNewListing));

router.get("/listing/category/:category",wrapAsc(listingControllers.filterListing));
router.get("/listing/destinations",wrapAsc(listingControllers.search));
// show route
router.get("/listing/:id", middleware.isLoggedIn,wrapAsc(listingControllers.showListing ));

// app.post("/listing/:id")

// edit route
router.route("/listing/:id/edit")
.get( middleware.isOwner, middleware.isLoggedIn, wrapAsc(listingControllers.renderEditForm))
.post( middleware.isOwner, middleware.isLoggedIn,upload.single('image'), middleware.validateListing, wrapAsc(listingControllers.editListing))

//detete route
router.get("/listing/:id/delete", middleware.isOwner, middleware.isLoggedIn, wrapAsc(listingControllers.deleteListing));


module.exports = router;