const path = require("path");
const multer = require("multer");



//photo Storage
const photoStorage = multer.diskStorage({
    destination : (req, File, cb) =>{
        cb(null, path.join(__dirname, "../images"))
    },
    filename : (req, res, cb)=>{
        if(file){
            cb(null, new Date().toString().replace(/:/g,"-") + file.originalname);
        }else{
            cb(null, false);
        }
    }
})


//Photo Upload middleware

const photoUpload = multer({
    storage : photoStorage,
    fileFilter: (req, file, cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null, true)
        }else{
            cb({message : "Unsupported type file form"}, false)
        }
    },limits:{
        fileSize : 1024*1024
    }
})


module.exports = photoUpload;