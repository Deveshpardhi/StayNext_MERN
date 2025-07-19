const { model } = require("mongoose");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing");

module.exports.createReview=async (req, res) => {
  const listing   = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created!");
console.log("Review saved");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
  let {id,reviewId} = req.params;

  await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");
  res.redirect(`/listing/${id}`);
};
// 