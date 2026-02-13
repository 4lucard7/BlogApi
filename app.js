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
app.use("/api/users", require("./routes/user"))
app.use("/api/posts", require("./routes/post"))
app.use("/api/comments", require("./routes/comment"))
app.use("/api/categories", require("./routes/category"))



//error handling middleware
app.use(require("./middlewares/error").notFound);
app.use(require("./middlewares/error").errorHandler);




const Port = process.env.PORT;
app.listen(Port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} on Port ${Port}`)
})