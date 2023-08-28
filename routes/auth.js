const express = require("express");
const passport = require("../config/passport");
const User = require("../models/user");
const router = express.Router();

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("login", { isLogged: false });
  });
  
router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("register", { isLogged: false });
  });
  

router.get("/logout", function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/login");
        }
    });
  }); 
  
  router.post("/register", function(req, res){
    User.register(new User({
      username: req.body.username,
      email: req.body.email,
    }), req.body.password, function(err, user){
      if(err){
        console.error(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/");
        });
      }
    });
  });
  
router.post("/login", function(req, res){
    const user = new User({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password, 
    });
    req.login(user, (err) =>{
        if(err){
            console.log(err);
            res.redirect("/login");
        } else{
            passport.authenticate("local") (req, res, function(){
                res.redirect("/");
            });
        }
    });
  });

module.exports = router;