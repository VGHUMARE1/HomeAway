ize = async () => {
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