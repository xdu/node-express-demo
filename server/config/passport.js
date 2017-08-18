var LocalStrategy = require('passport-local').Strategy

var User = require('../models/users')

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        if (email) {
            email = email.toLowerCase()
        }
        process.nextTick(function() {
            User.findOne({'local.email': email},
            function(err, user) {
                if (err) {
                    return done(err)
                }
                if (! user) {
                    return done(null, false, req.flash('loginMessage', 'no user found'))
                }
                if (! user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'wrong password'))
                } else {
                    return done(null, user)
                }
            })
        })
    }))

    passport.use('local-singup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        if (email) {
            email = email.toLowerCase
        }
        process.nextTick(function() {
            if (! req.user) {
                User.findOne({'local.email': email},
                function(){
                    if (err) {
                        return done(err)
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'email is already taken'))
                    } else {
                        var newUser = new User()
                        newUser.local.name = req.body.name
                        newUser.local.email = email
                        newUser.local.password = newUser.generateHash(password)
                        newUser.save(function(err) {
                            if (err) {
                                throw err
                            }
                            return done(null, newUser);
                        })
                    }
                })
            } else {
                return done(null, req.user)
            }
        })
    }))
}