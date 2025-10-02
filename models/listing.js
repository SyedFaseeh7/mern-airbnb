const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
    type : String,
    required : true,
    },
    description : String,
    image :{
        type : String,//url.
        default : "https://unsplash.com/photos/coconut-tree-near-shore-within-mountain-range-RN6ts8IZ4_0",
        set: (v) => v === "" ? "https://unsplash.com/photos/coconut-tree-near-shore-within-mountain-range-RN6ts8IZ4_0 " : v, 
    },
    price : Number,
    location : String,
    country : String,
});

const Listing =  mongoose.model("Listing",listingSchema);
module.exports = Listing;