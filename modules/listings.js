const User= require("./users");
const mongoose = require("mongoose");
const Review = require("./reviews");


const listeningSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: "",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
   geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  category:{
        type:String,
        enum:["trending","rooms","conic-cities","mountains","castles","amazing-pools","camping","farms","arctic","play","new","domes","boats"]
  }

});

listeningSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        let res = await Review.deleteMany({ _id: { $in: listing.review } });
    }
})
const SampleListing = mongoose.model("SampleListing", listeningSchema);
module.exports = SampleListing;