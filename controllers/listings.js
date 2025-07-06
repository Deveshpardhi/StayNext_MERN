const { model } = require("mongoose");
const Listing=require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

// module.exports.showListing=async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
//   res.render("listings/show.ejs", { listing });
// };
module.exports.postListing=async (req, res,next) => {
  let responce=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 2
})
.send()

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filename};
    newListing.geometry=responce.body.features[0].geometry;
    let savelisting=await newListing.save();
    console.log(savelisting);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  };

module.exports.editListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  };

module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  };
module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleated!");
    res.redirect("/listings");
  };

