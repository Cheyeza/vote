const express = require('express')
const bodyParser = require('body-parser')
const router = express()
var fs = require("fs");

const cors = require('cors');
const http = require('http')

//routes for students and candidates
const register = require("../Controllers/students/register")
const login = require("../Controllers/students/login")
const candidate = require("../Controllers/students/candidates")


//code for uploading files
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: 'dhtppljex',
  api_key: '259573781321246',
  api_secret: '1O8o4GDLf82SMhjj8yL9kPJRrSE',
});

const storage = new CloudinaryStorage({
cloudinary: cloudinary,
params: {
  folder: "DEV",
},
});

const upload = multer({ storage: storage });
//image
router.post("/newUpload", upload.single("file"), async (req, res) => {
  return res.json({ file: req.file.path});
})

//video
router.post("/video/upload", async (req, res) => {
    // Get the file name and extension with multer
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const fileExt = file.originalname.split(".").pop();
        const filename = `${new Date().getTime()}.${fileExt}`;
        cb(null, filename);
      },
    });

    // Filter the file to validate if it meets the required video extension
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === "video/mp4") {
          cb(null, true);
        } else {
          cb(
            {
              message: "Unsupported File Format",
            },
            false
          );
        }
      };

       // Set the storage, file filter and file size with multer
  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 30 * 1024 * 1024,
    },
    fileFilter,
  }).single("video");

  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
        cloud_name: 'dhtppljex',
        api_key: '259573781321246',
        api_secret: '1O8o4GDLf82SMhjj8yL9kPJRrSE',
    });
    const { path } = req.file; // file becomes available in req at this point

    const fName = req.file.originalname.split(".")[0];
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "video",
        public_id: `VideoUploads/${fName}`,
        chunk_size: 6000000,
        eager: [
          {
            width: 300,
            height: 300,
            crop: "pad",
            audio_codec: "none",
          },
          {
            width: 160,
            height: 100,
            crop: "crop",
            gravity: "south",
            audio_codec: "none",
          },
        ],
      },

      // Send cloudinary response or catch error
      (err, video) => {
        if (err) return res.send(err);

        fs.unlinkSync(path);
        return res.send(video);
      }
    );
  });

})

router.use(bodyParser.json())
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
const port = process.env.PORT || 3001;

var corsOptions = {
  origin:"http://localhost:4200"
}

router.use(cors(corsOptions));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
  next();
});

router.use(bodyParser.json())
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

router.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

     //routes for registering
router.post('/register', register.registerUser)
// routes for logging in
router.post('/login', login.passengerLogin)

// routes for logging in
router.post('/candidate', candidate.candidateInfo)

  router.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })