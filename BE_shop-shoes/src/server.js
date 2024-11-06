import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
import connectDB from "./config/connectDB";
import initWebRoutes from "./routes/web";
const cors = require("cors");

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//config body-parser
app.use(bodyParser.json({ limit: "50mb" })); // doc nhung data tu client gui len dang json
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // doc nhung data dang body

//connectDB
connectDB();

//initWebRoutes
initWebRoutes(app);

const PORT = process.env.PORT || 8686;
app.listen(PORT, () => {
  console.log(">>> Backend is running on the port = " + PORT);
});
