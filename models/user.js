'use strict';
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    profile: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            default: ""
        },
        userName: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        avatar: {
            id: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: ""
            }
            // low: {
            //     id: {
            //         type: String,
            //         default: ""
            //     },
            //     url: {
            //         type: String,
            //         default: ""
            //     }
            // },
            // high: {
            //     id: {
            //         type: String,
            //         default: ""
            //     },
            //     url: {
            //         type: String,
            //         default: ""
            //     }
            // }
        },
        bio: {
            type: String,
            default: ""
        },
        status: {
            type: Date,
            default: Date.now,
            required: true
        },
        location: {
            country: {
                type: String,
                default: ""
            },
            state: {
                type: String,
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            timeZone: {
                type: String,
                default: ""
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // accessTokens: [{
    //     type: String,
    //     default: ""
    // }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Msg'
    }],
    invites: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    contacts: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: 'ChatReceiver'
        }
    }],
    // groups: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'GroupFollower'
    // }],
    // channels: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Channel-follower'
    // }]
    chats: [{
        type: Schema.Types.ObjectId,
        ref: 'ChatReceiver'
    }]
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);