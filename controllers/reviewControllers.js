const Review=require("../modules/reviews.js");
const SampleListing=require("../modules/listings.js");

module.exports.distroyReview=async (req, res, next) => {
    let { id, reviewId } = req.params;
    await SampleListing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review deleted sucessfully');
    res.redirect(`/listing/${id}`);

}

module.exports.createReview=async (req, res, next) => {
    const { id } = req.params;
    let newreview = new Review(req.body);
    newreview.author=req.user._id;
    let result = await SampleListing.findById(id);
    result.review.push(newreview);
    await result.save();
    await newreview.save();
    req.flash('success', 'review added sucessfully');
    res.redirect(`/listing/${id}`);

}