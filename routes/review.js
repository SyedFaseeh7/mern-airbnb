const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const CustomError = require("../utils/CustomError.js");
const {reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Review Route.

const validateReview = (req,res,next) => {
     let {error} = reviewSchema.validate(req.body);//Validate the schema.
    if(error){

        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new CustomError(400,error);
    }else{
        next();
    }
}
//1)Post Review Route.
router.post("/",validateReview,wrapAsync(async (req,res,next) => {
        //First validate the review
        let {id} = req.params;
        let listing = await Listing.findById(id);

        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);
        await newReview.save();

       await listing.save();
        req.flash("success","New Review Created!");

    console.log("new review saved");
    res.redirect(`/listings/${id}`);
}));

//2)Delete Review Route.
router.delete("/:reviewId",wrapAsync(async (req,res,next) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
         await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");
        res.redirect(`/listings/${id}`);
}));

module.exports = router;