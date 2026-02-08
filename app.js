const express =require("express");
const connectDb = require("./config/connectDb")
require("dotenv").config()
//INIT app
const app = express();

//connection to DB
connectDb();


//middlewares
app.use(express.json());


//Routes
app.use("/api/auth", require("./routes/auth"))




const Port = process.env.PORT;
app.listen(Port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} on Port ${Port}`)
})