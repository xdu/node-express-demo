var express = require('express');
var router = express.Router();
var passport = require('passport')
var gravatar = require('gravatar')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express from server folder' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login page', message: req.flash('loginMessage')})
})

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Sign up', message: req.flash('signupMessage')})
})

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}))

router.get(
  '/profile', 
  function(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  },
  function(req, res, next) {
    res.render('profile', {title: 'Profile', user: req.user })
  }
)

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router;
