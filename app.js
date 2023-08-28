require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("./config/db.js");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const authRoutes = require("./routes/auth.js");
const blogRoutes = require("./routes/blog.js");
const User = require('./models/user');

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

const aboutContent = "This is just an exercise site for blog posts where I can practice Express, JS, EJS, Passport, MongoDB and more.";
const contactContent = "test@gmail.com.";

app.get('/', async (req, res) => {
  if (req.isAuthenticated()){
     
        const allUsers = await User.find({});

        const allBlogPosts = [];

        allUsers.forEach(user => {
            if (user.blogPost && user.blogPost.length > 0) {
                allBlogPosts.push(...user.blogPost);
            }
        });

        res.render('home', {
            homeContent: 'Your Home Page Content',
            posts: allBlogPosts,
            isLogged : true
        });
  } else  {
      res.render("login", {
           isLogged : false
      });
    }
});

app.get("/about", (req, res) => {
  if(req.isAuthenticated()){
    res.render("about.ejs", {
      aboutPageContent: aboutContent,
      isLogged: req.isAuthenticated()
    });
  } else{
    res.redirect("/login");
  }
});

app.get("/contact", (req, res) => {
  if(req.isAuthenticated()){
    res.render("contact.ejs", {
      contactPageContent: contactContent,
      isLogged: req.isAuthenticated()
    });
  } else{
    res.redirect("/login");
  }
});

app.use("/", authRoutes);

app.use("/", blogRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});