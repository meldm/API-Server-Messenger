'use strict';
// var passport = require('passport');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Auth = require('../controllers/auth');
var Email = require('../controllers/email');
var User = require('../models/user');
var config = require('../config/database');

exports.signup = function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please pass email and password.' });
    } else {
        // var newUser = new User({
        //     email: req.body.email,
        //     password: req.body.password,
        //     profile: {
        //         userName: req.body.profile.userName,
        //         firstName: req.body.profile.firstName,
        //         lastName: req.body.profile.lastName
        //     }
        // });
        var newUser = new User(req.body);
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Email already exists.' });
            } else {
                res.json({ success: true, msg: 'Successful created new user.' });
                // Email.logupEmail(email);
            }
        });
    }
};

exports.signin = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, config.secret);
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        id: user.id,
                        token: 'JWT ' + token
                    });
                    // обновляем статус
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
};


// DELETE
exports.signout = function(req, res) {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.params.userId, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                // recreate token
                // обновляем статус
                res.status(401).send({ success: true, msg: 'User log out.' });
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};
// DELETE


exports.getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};