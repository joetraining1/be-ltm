const express = require('express');
const cors = require('cors');
const FileUpload = require('express-fileupload');

// const { init } = require('./config/db')

require('dotenv').config()

const app = express();

// init()
app.use(express.json());
app.use(cors());
app.use(FileUpload());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send({ message: "You're connected to this api." });
  });

app.listen(3030, () => {
    console.log('Server up and running...')
})