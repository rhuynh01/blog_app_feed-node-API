const express = require("express");
const { body } = require("express-validator");

const isAuth = require('../middleware/is-Auth');
const feedController = require("../controllers/feed");

const router = express.Router();

// GET /posts
router.get("/posts", isAuth, feedController.getPosts);

// CREATE POST /post
router.post(
  "/posts",
  isAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 5 }),
    body("content")
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

// GET single Post
router.get('/posts/:postId', isAuth, feedController.getPost);

// Update single Post
router.put('/posts/:postId',  isAuth,  [
  body("title")
    .trim()
    .isLength({ min: 5 }),
  body("content")
    .trim()
    .isLength({ min: 5 })
], feedController.updatePost);

// Delete single Post
router.delete('/posts/:postId', isAuth, feedController.deletePost);

module.exports = router;
