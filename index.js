const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const port = process.env.PORT || 3001;

// *database
require("./db/connection");

// *cors
const allowedOrigins = [
  "http://localhost:3000",
  "https://ecommerce-app-a7347.web.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
// linking express router
app.use(require("./router/route"));

app.listen(port, () => {
  console.log(`server is up and running at the port ${port}.`);
});
