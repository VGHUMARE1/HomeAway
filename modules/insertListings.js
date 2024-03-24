
let { initdata } = require("./listingsData.js");
const mongoose = require("mongoose");
const SampleListing = require("../modules/listings.js");
const main = async () => {
    await mongoose.connect('mongodb+srv://ghumarevaishnavib:xLogwsBPI9pOqZai@cluster0.pkgv1j5.mongodb.net/?retryWrites=true&w=majority');
}
main().then(() => {
    console.log("Connected....")
}).catch((err) => {
    console.log(err);
})


const initialize = async () => {
    await SampleListing.deleteMany({});
//    initdata= initdata.map((obj) => ({
//         ...obj,
//        owner: "65e8b3fffdc903d86e01648c"
//     }))
//     await SampleListing.insertMany(initdata);
    const data = SampleListing.find({});
console.log(data);
}

initialize().catch((err) => {
    console.log(err);
})