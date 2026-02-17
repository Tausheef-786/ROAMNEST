const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/Listing.js");
main().then((res)=>{                    // main ne promise return kiya to uska use kr rhe hai by using then;
    console.log("connection succsessful.");
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/RoamNest');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("succsesfull connection");
};
initDB();