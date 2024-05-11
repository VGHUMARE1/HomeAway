const SampleListing = require("../modules/listings.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAPBOX_ACESS_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: token });
const Users = require("../modules/users.js");
const Review= require("../modules/reviews.js");
module.exports.index = async (req, res, next) => {
    const result = await SampleListing.find();
    res.render("listing/index.ejs", { result });
}

module.exports.renderNewListingForm = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.createNewListing = async (req, res, next) => {

    const response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    let newList = new SampleListing(req.body);
    newList.geometry = response.body.features[0].geometry;
    let filename = req.file.filename;
    let url = req.file.path;
    let listingUser = req.user;
    newList.owner = listingUser._id;
    newList.image = { filename, url };
    await newList.save()
    req.flash('success', 'new listing added sucessfully');
    res.redirect("/");

}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const result = await SampleListing.findById(id).populate('owner').populate({path:'review',populate:{
        path:'author',
    }});
      console.log(result);
    res.render("listing/show.ejs", { result });

}
module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const result = await SampleListing.findById(id);
    if (!result) {
        req.flash('error', 'listing you want to edit does not exit');
        res.redirect("/");
    }
    res.render("listing/edit.ejs", { result });
}

module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    const response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const listing = await SampleListing.findById(id);
    if (!listing) {
        req.flash('error', 'listing you want to edit does not exit');
        res.redirect("/");
    } else {
        // let { title, description, price, location, country } = req.body;
        await SampleListing.findByIdAndUpdate(id, { ...req.body }, { runValidators: true });
        if (req.file) {
            let filename = req.file.filename;
            let url = req.file.path;
            await SampleListing.findByIdAndUpdate(id, { image: { filename, url } })
        }
        await SampleListing.findByIdAndUpdate(id, { geometry:response.body.features[0].geometry})
        req.flash('success', 'listing edited sucessfully');
        res.redirect(`/listing/${id}`);
    }
}

module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await SampleListing.findById(id);
    if (!listing) {
        req.flash('error', 'listing you want to delete does not exit');
    } else {
        await SampleListing.findByIdAndDelete(id);
        req.flash('success', 'listing deleted sucessfully');
    }
    res.redirect("/");
}

module.exports.filterListing=async(req,res)=>{
    const {category}=req.params;
    const result=await SampleListing.find({category:category});
    res.render("listing/index.ejs",{result});
}
module.exports.search=async(req,res)=>{
    const {search}=req.query;
    const result=await SampleListing.find({location:search});
    res.render("listing/index.ejs",{result});
}