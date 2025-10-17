const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const CustomError = require("../utils/CustomError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next) => {
     let {error} = listingSchema.validate(req.body);//Validate the schema.
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new CustomError(400,error);
    }else{
        next();
    }
}


//Index Route.
router.get("/",wrapAsync(async (req,res) => {
     const allListings = await Listing.find({});
     res.render("./listings/index.ejs",{allListings});
    
}));

//New Route.
router.get("/new",(req,res) => {
    res.render("listings/new.ejs");
});

//Show Route.
router.get("/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        //Flash an error message if the requested listing is not found.
        req.flash("error","The Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Create Route.
router.post("/",validateListing,wrapAsync(async (req,res,next) => {
        //First validate the schema of the req.
       const newListing = new Listing(req.body.listing);
       await newListing.save();
       req.flash("success","New Listing Created!");
       res.redirect("/listings");
}));

//Edit Route.
router.get("/:id/edit",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        //Flash an error message if the requested listing is not found.
        req.flash("error","The Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route.
router.put("/:id",validateListing,wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","Listing  Updated!");
    res.redirect(`/listings/${id}`);
}));


//Destroy Route.
router.delete("/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;