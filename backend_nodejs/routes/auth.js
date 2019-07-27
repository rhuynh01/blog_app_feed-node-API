const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-Auth');


const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

// Signup new User
router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject();
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('name')
    .trim()
    .not()
    .isEmpty()
], authController.signup);


// Login User
router.post('/login', authController.login)

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
  body('status')
    .trim()
    .not()
    .isEmpty()
], authController.updateUserStatus);

module.exports = router;
