const mongoose = require('mongoose');
const reviews = require('./reviews');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename:String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type:{
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
 });

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in: listing.review}})
    }
});


const listing = mongoose.model("Listing",listingSchema);
module.exports = listing;
