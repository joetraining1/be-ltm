const express = require('express');
const cors = require('cors');
const FileUpload = require('express-fileupload');

// const { init } = require('./config/db')

require('dotenv').config()
const PORT = 3030;

const app = express();

// init()
app.use(express.json());
app.use(cors());
app.use(FileUpload());
app.use(express.static("public"));

const { JWTController } = require('./controllers/JWTCon')

const typeRouter = require('./routes/Type');

app.use("/type", typeRouter);

app.get("/", (req, res) => {
    res.send({ message: "You're connected to this api." });
  });



app.listen(PORT, () => {
    console.log('Server up and running on: '.concat(PORT))
})