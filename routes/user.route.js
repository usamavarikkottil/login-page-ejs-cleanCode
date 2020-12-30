// Required packages
const router = require('express').Router();
const passport = require("passport");

// importing User Model 
const User = require('../models/user.model');

// Routes
router.get("/", (req, res) => {

    if (req.isAuthenticated()) {
        res.send("You are logged in as " + req.user.username);
    } else {
        res.redirect("/login")
    }

})

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login")
});

router.post("/register", (req, res) => {

    console.log(req.body.username, req.body.password);
    const newUser = new User({ username: req.body.username });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.status(401).json({
                "success": "false", "message": err.message
            })
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });;
        }
    });
});

router.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    console.log(user);

    req.login(user, (err) => {
        if (err) {
            res.status(401).json({
                "success": "false", "message": err.message
            })
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });
        }
    });
});

// Exporting User router
module.exports = router;