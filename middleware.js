
const SampleListing = require("./modules/listings");
const Review = require("./modules/reviews");
const ExpressError = require("./utils/ExpressError.js");
const {listingValidate,reviewValidate}=require("./utils/ListingSchema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must loged in");
        res.redirect("/login");
    } else {
        next();
    }
}

module.exports.redirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = "/listing";
    }
     next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await SampleListing.findById(id);
    if (!req.user._id.equals(listing.owner._id)) {
        req.flash("error", "you don't have permisson do edit/delete listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!req.user._id.equals(review.author)) {
        req.flash("error", "you are not author of this comment");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingValidate.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next(error);
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewValidate.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}
