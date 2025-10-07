const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const CustomError = require("./utils/CustomError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res) => {
    res.send("Hi, i am root");
});

// app.get("/testListing",async (req,res) => {
//    let sampleListing = new Listing({
//     title : "My new Villa",
//     description : "By the beach",
//     price : 1200,
//     location : "Calangute, Goa",
//     country : "India",
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successfull testing"); 
// });

//Index Route.
app.get("/listings",wrapAsync(async (req,res) => {
     const allListings = await Listing.find({});
     res.render("./listings/index.ejs",{allListings});
    
}));

//New Route.
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

//Show Route.
app.get("/listings/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//Create Route.
app.post("/listings",wrapAsync(async (req,res,next) => {
    if(!req.body.listing){
        throw new CustomError(400,"Sent valid data for Listing");
    }
       const newListing = new Listing(req.body.listing);
       await newListing.save();
       res.redirect("/listings");
}));

//Edit Route.
app.get("/listings/:id/edit",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route.
app.put("/listings/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    if(!req.body.listing){
        throw new CustomError(400,"Sent valid data for Listing");
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Destroy Route.
app.delete("/listings/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Error handling middleWares.(Server side).
app.all(/.*/,(req,res,next) => {//Throw page not found if req route doesn't match any above routes. 
 next(new CustomError(404,"Page Not Found!"));
});

app.use((err,req,res,next) => {
    let {status : statusCode = 500,message = "Something went wrong!"} = err;
    res.status(statusCode).send(message);
})

app.listen(8080,() => {
    console.log("server is listening to port 8080");
})