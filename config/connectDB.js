const mongoose = require("mongoose")
async function connect() {
    // try {
    //   // await mongoose.connect("mongodb://localhost:27017/nckh");
    //   await mongoose.connect("mongodb://root:hnam23012002@64.176.85.32:27017/nckh?authMechanism=DEFAULT");

    //   console.log("connect succeeded");
    // } catch (e) {
    //   console.log(e)
    //   console.log("connect fail");
    // }
    
      mongoose
      .connect("mongodb+srv://hieuls1232003:ySHDEDhnEuS6ZgpI@cluster0.9gsag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        dbName: "nckh",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // tăng lên 30 giây
        socketTimeoutMS: 45000, 
      })
      .then(() => {
        console.log("Database connection Success.");
      })
      .catch((err) => {
        console.error("Mongo Connection Error", err);
      });
  }
  
  module.exports = { connect };
  