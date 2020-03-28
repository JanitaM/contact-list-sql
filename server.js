const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2/promise");

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createPool({
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD
});

const { routes } = require("./src/routes/contactRoutes");

routes(app);

app.use(express.static(__dirname + "/src/views"));

// Home
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/src/views/index.html")));

const PORT = process.env.PORT || 3000;

const start = () => {
  return app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
}

module.exports = { start }