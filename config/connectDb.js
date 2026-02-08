const mongoose = require("mongoose");



module.exports = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect to mongoDb :)")
    } catch (error) {
        console.error(error);
        
    }
}