const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const path = require("path");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const port = 8080;

const MONGODB_URI =
  "mongodb+srv://rodney:4Snooker@cluster0-gbhul.mongodb.net/messages?retryWrites=true&w=majority";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, uuidv4() + '.' + fileExtension);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(result => {
    app.listen(port);
    const server = app.listen(port); 
    console.log(`Node.js is listening on port ${port}`);

    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('A new client connected.')
    })
  })
  .catch(error => console.log(error));
