const express        = require("express");
const router         =  express.Router({mergeParams : true});
const wrapAsync      = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const review = require("../routes/review.js");
const Listing        = require("../models/listing.js");
const Review         = require("../models/reviews.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController =require("../controllers/review.js");

/*---------- Validate review----------*/
const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


/* Reviews – create */
router.post("/",isLoggedIn,validateReview,wrapAsync( reviewController.createReview));

//delete review 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;