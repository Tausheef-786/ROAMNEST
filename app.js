const express = require("express");
const app = express();
const Listing = require("./Models/Listing.js");
const path = require("path")
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js")
const wrapAysnc = require("./utils/wrapAsync.js");
const{listingSchema} = require("./schema.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
 app.use(express.json());
 const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then((res)=>{                    // main ne promise return kiya to uska use kr rhe hai by using then;
    console.log("connected to DB.");
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/RoamNest');
}

app.get("/",(req,res)=>{
    res.send("hii i am routs");
});
// index Route;
app.get("/listings",wrapAysnc(async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index",{allListings});
}));

// New Route;*6
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

// show Route;
app.get("/listings/:id",wrapAysnc(async(req,res)=>{
let {id} =  req.params;
const listing = await Listing.findById(id);
res.render("listings/show",{listing});
}));

// POST Route: Create a new listing with error handling
app.post("/listings", wrapAysnc(async (req, res, next) => {
    // 1. Check if req.body exists at all
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing. 'listing' object is missing.");
    }

    // 2. Validate the data against your Joi Schema (listingSchema)
    let { error } = listingSchema.validate(req.body); 
    
    if (error) {
        // Map through Joi details to create a readable error message
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    // 3. If validation passes, save the listing
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    
    console.log("New listing saved successfully!");
    res.redirect("/listings");
}));

// Edit Rout;
app.get("/listings/:id/edit", wrapAysnc(async (req,res)=>{
   let {id} =  req.params;
const listing = await Listing.findById(id);
res.render("listings/edit",{listing});
}));

// Update Route

app.put("/listings/:id", wrapAysnc(async (req,res)=>{
    let {id} = req.params;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
   await Listing.findByIdAndUpdate(id, {...req.body.listing}); // ... destructuring operator hai jo object ke andar ke value ko alag alag variable me store karta hai;
    res.redirect(`/listings/${id}`);
}));

// Delete Route ;
app.delete("/listings/:id",wrapAysnc(async (req,res)=>{
    let {id} = req.params;
   let deletedListing =  await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));

// app.get("/TestListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "Bye the beech",
//         price : 1200,
//         location : "kerla",
//         country : "India"
//     });
//      await sampleListing.save();
//      console.log("samle was saved");
//     res.send("Testing is successfull");
// });
app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
     let{statusCode=500,message="Page Not Found!"} = err;
   res.status(statusCode).render("error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("server is listening at port 8080");
});

