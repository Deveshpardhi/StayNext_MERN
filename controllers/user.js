const { model } = require("mongoose");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing");
const User=require("../models/user");

module.exports.signUp=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUpPost=async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            req.flash("success","Welcome to wanderlust!");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
};

module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginPost= async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust !");
        let redirectUrl=res.locals.redirectUrl || "/listings" ;
        res.redirect(redirectUrl);
    };

module.exports.logOut=(req,res,next) =>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    });
};
// 