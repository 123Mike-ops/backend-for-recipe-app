const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/user-route");
const recipeRouter = require("./routes/recipe-route");
const session = require("express-session");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "this is secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", userRouter);
app.use("/recipe", recipeRouter);

module.exports = app;
