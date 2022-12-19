const postRoute = require('express').Router()

const dotenv = require('dotenv');
dotenv.config();
const PostModel = require('../Modals/PostDataModal')
const bodyParser = require('body-parser')
postRoute.use(bodyParser.json())
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true
  });
const cors = require("cors");
postRoute.use(cors());
// // for storing files
const multer = require("multer")
// const upload = multer({storage:multer.diskStorage({
// })})
const ownStorage = multer.diskStorage({
    // destination: (req,file,cb) => {
    //     cb(null,  "local_folder/files" );
    // },
    // filename: (req,file,cb) => {
    //     cb(null, file.originalname)
    // }
})
const upload = multer({storage:ownStorage})
postRoute.get('/PostView', async (req,res) => {
    try{
        let found = await PostModel.find().sort({order:-1});
        res.json(found)
    } catch(err) {
        res.json({
            result : "failure"
        })
    }
})
postRoute.post('/PostData',upload.single('imageData1'), async (req,res) => {
    console.log(req.body,req.file)
    try{
        console.log('before');
        // {// upload_preset: 'Images'}
        const uploadedImage = await cloudinary.uploader.upload(req.file.path)
        
        let obj = {
            file: uploadedImage.secure_url,
            name : req.body.author1,
            description : req.body.description1,
            location : req.body.location1,
            order: Date.now()
        }
        console.log(obj)
        console.log('AFTER')
        await PostModel.create(obj)
        .then(res => console.log(res))
        .catch(err => console.log(err))
        res.status(200).json({
            result : "success",
            frontEndMessage : req.body,
            addedData : obj
        })
    } catch(err) {
        res.status(400).json({
            result : "failure",
            message: err.message
        })
    }
})

module.exports = postRoute













