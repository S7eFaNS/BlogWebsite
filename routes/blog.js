const express = require("express");
const _ = require("lodash");
const User = require("../models/user");

const router = express.Router();

router.get("/compose", (req, res) => {
    if(req.isAuthenticated()){
      res.render("compose", {
        isLogged: req.isAuthenticated()
      });
    } else{
      res.redirect("/login");
    }
  });

  router.post("/compose", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }

    const newBlogPost = {
        title: req.body.postTitle,
        description: req.body.postBody,
    };

    const currentUser = req.user;

    currentUser.blogPost.push(newBlogPost);

    try {
        await currentUser.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.redirect("/about");
    }
});

router.get('/posts/:postName', async (req, res) => {
  const requestedTitle = req.params.postName;

  try {
    const user = await User.findOne({
      'blogPost.title': { $regex: new RegExp('^' + requestedTitle, 'i') },
    });

    if (user) {
      const blogPost = user.blogPost.find(
        (post) => post.title.toLowerCase() === requestedTitle.toLowerCase()
      );

      if (blogPost) {
        res.render('post', {
          title: blogPost.title,
          description: blogPost.description,
          author: user.username,
          isLogged: req.isAuthenticated(),
        });
      } else {
        res.status(404).send('Blog post not found');
      }
    } 
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
  
module.exports = router;