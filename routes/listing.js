const express        = require("express");
const router         =  express.Router();
const wrapAsync      = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const Listing        = require("../models/listing.js");
const {isLoggedIn, saveRedirectUrl, isOwner}   = require("../middleware.js");
const listeningController =require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })



/*---------- Validate Listing---------*/
const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

/* Index */
router.get("/", wrapAsync(listeningController.index));
  
  /* New form */
  router.get("/new", isLoggedIn, listeningController.renderNewForm);
  
  /* Create */
  router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listeningController.postListing));
//   router.post("/",,(req,res)=>{
//     console.log('Cloudinary key →', process.env.CLOUD_API_KEY);
//     res.send(req.file);
//   });
  
  /* Edit form */
  router.get("/:id/edit",isLoggedIn,isOwner, listeningController.editListing);
  
  /* Show */
  // router.get("/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const listing = await Listing.findById(id).populate("reviews");
  //   res.render("listings/show.ejs", { listing });
  // });
  
  /* Update (fixed) */
  router.put("/:id",isLoggedIn,isOwner, listeningController.updateListing);
  
  
  
  /* Delete */
  router.delete("/:id", isLoggedIn,isOwner,listeningController.deleteListing);
  
module.exports=router;