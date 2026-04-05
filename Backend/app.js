const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");


const todoroutes = require('./src/routes/todoroute')
const authroutes = require('./src/routes/authroutes')

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", todoroutes);
app.use("/api", authroutes);
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

module.exports = app;