const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ListingSchema = new Schema({
    title:{
        type : String,
        required : true,
    },

    description : {
        type : String,
    },
    image : {
        filename : {
            type : String,
            default : "listingimage",
        },
        url :{
            type : String,  
// yhan hamne default imgage set kar rhe hai uske baad arrow fxn use kiya hai or uske andar ternary operator likha hai v ek value hai image ki
default:
    "https://images.unsplash.com/photo-1761839258753-85d8eecbbc29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
  set:(v) => v===" "?
 "https://images.unsplash.com/photo-1761839258753-85d8eecbbc29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8": v,
    
}
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;