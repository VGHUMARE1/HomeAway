
let { initdata } = require("./listingsData.js");
const mongoose = require("mongoose");
const SampleListing = require("../modules/listings.js");
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/HomeAway');
}
main().then(() => {
    console.log("Connected....")
}).catch((err) => {
    console.log(err);
})


const initialize = async () => {
    await SampleListing.deleteMany({});
   initdata= initdata.map((obj) => ({
        ...obj,
       owner: "65e8b3fffdc903d86e01648c"
    }))
    await SampleListing.insertMany(initdata);
    const data = SampleListing.find({});
console.log(data);
}

initialize().catch((err) => {
    console.log(err);
})