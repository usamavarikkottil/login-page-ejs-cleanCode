// Required Packages
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();


const userRoute = require("./routes/user.route");
const User = require("./models/user.model");
const app = express();

// middlewares
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 999999999,
        rolling: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//db config
mongoose.connect(process.env.MONGO_DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", () => {
    console.log("MongoDB connection successfull...");

});

// routes
app.use("/", userRoute);



// Server Listening
app.listen(5000, () => console.log('port 5000 started'));