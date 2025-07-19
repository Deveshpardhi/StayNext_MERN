// if(process.env.NODE_EVN !="production"){
//   require("dotenv").config();
// }
require('dotenv').config(); 

// app.js  – complete file with the update-route fix
const express        = require("express");
const app            = express();
const mongoose       = require("mongoose");
const Listing        = require("./models/listing.js");
const Review         = require("./models/reviews.js");
const path           = require("path");
const methodOverride = require("method-override");
const ejsMate        = require("ejs-mate");
const wrapAsync      = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema}= require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const session = require("express-session");
const passport = require("passport");
const User = require("./models/user.js");
//const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");


/* ---------- DB ---------- */
(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("connect to DB");
  } catch (err) {
    console.log(err);
  }
})();

/* ---------- App config ---------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//sessions
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());



//Authentication
app.use(passport.initialize());
app.use(passport.session());

/* changed this line ↓ */
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/* ---------- Routes ---------- */
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

//demo user
// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username:"delta-student",
//   });
//   let registeredUser = await User.register(fakeUser,"hello");
//   res.send(registeredUser);
// });

// Middleware
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Listing routers
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// /*---------- Validate Listing-----------*/
// const validateListing =(req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg =error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };
/*---------- Validate review-----------*/
// const validateReview =(req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg =error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };

// /* Index */
// app.get("/listings", wrapAsync(async (req, res) => {
//   const allListings = await Listing.find();
//   res.render("listings/index.ejs", { allListings });
// }));

// /* New form */
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// /* Create */
// app.post("/listings",validateListing, wrapAsync(async (req, res,next) => {
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// }));

// /* Edit form */
// app.get("/listings/:id/edit", async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// });

/* Show */
app.get("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
  res.render("listings/show.ejs", { listing });
});

// /* Update (fixed) */
// app.put("/listings/:id", async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndUpdate(id, req.body.listing);
//   res.redirect(`/listings/${id}`);
// });



/* Delete */
// app.delete("/listings/:id", async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// });

// /* Reviews – create */
// app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
//   const listing   = await Listing.findById(req.params.id);
//   const newReview = new Review(req.body.review);

//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();
// console.log("Review saved");
//   res.redirect(`/listing/${listing._id}`);
// }));

// //delete review 
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//   let {id,reviewId} = req.params;

//   await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
//   await Review.findByIdAndDelete(reviewId);

//   res.redirect(`/listing/${id}`);
// }))

/* ---------- Listener ---------- */
app.listen(8080, () => {
  console.log("Server is listening to port: 8080");
});
