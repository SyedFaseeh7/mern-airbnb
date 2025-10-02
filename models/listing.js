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
        default : "https://images.unsplash.com/photo-1432889490240-84df33d47091?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlYWNofGVufDB8fDB8fHwy",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1432889490240-84df33d47091?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlYWNofGVufDB8fDB8fHwy" : v, 
    },
    price : Number,
    location : String,
    country : String,
});

const Listing =  mongoose.model("Listing",listingSchema);
module.exports = Listing;