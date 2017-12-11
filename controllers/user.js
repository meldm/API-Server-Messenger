'use strict';
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dczoe1wve',
    api_key: '646722669655435',
    api_secret: 'vuM5BPA5W9nDi8IFsvPk2U-8n3g'
});

var Auth = require('../controllers/auth');
var User = require('../models/user');
var ChatMain = require('../models/chat-main');
var ChatReceiver = require('../models/chat-receiver');
var Msg = require('../models/msg');

/************************************/
/*             User API             */
/************************************/
// GET: /users -> DELETE!!!!
exports.get_users = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.find({}, function(err, users) {
            if (err) res.send(err);
            res.json(users);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// GET: /my  ->  get my user profile
exports.get_my_profile = (req, res) => {
    // check user
    var token = Auth.getToken(req.headers);
    if (token) {
        // get user profile
        User.findById(req.headers.id, (err, user) => {
            if (err) next(err);
            res.json(user.profile);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// GET: /user/:userName  ->  get user profile by userName
exports.get_user_profile = (req, res) => {
    // check user
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findOne({ 'profile.userName': req.params.userName }, (err, user) => {
            if (err) next(err);
            res.json(user.profile);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// GET: /invites  ->  get array of invites profiles
exports.get_invites = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            var quantityInvites = my.invites.length;
            var countInvites = 0;
            var invitesOfMy = [];

            if (quantityInvites > 0) {
                my.invites.forEach((invite) => {
                    User.findOne(invite, (err, user) => {
                        if (err) next(err);

                        invitesOfMy.push(user.profile);
                        countInvites++;

                        if (countInvites == quantityInvites) res.json(invitesOfMy);
                    });
                });
            } else {
                res.json(invitesOfMy);
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// GET: /contacts  ->  get array of contacts profiles (json with array of objects)
exports.get_contacts = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            var quantityContacts = my.contacts.length;
            var countContacts = 0;
            var contactsOfMy = [];

            if (quantityContacts > 0) {
                my.contacts.forEach((contact) => {
                    User.findOne(contact.user, (err, user) => {
                        if (err) next(err);

                        var userJSON = {
                            userName: user.profile.userName,
                            firstName: user.profile.firstName,
                            lastName: user.profile.lastName,
                            bio: user.profile.bio,
                            avatar: user.profile.avatar,
                            status: user.profile.status,
                            location: user.profile.location,
                            chat: contact.chat
                        };
                        contactsOfMy.push(userJSON);
                        countContacts++;

                        if (countContacts == quantityContacts) res.json(contactsOfMy);
                    });
                });
            } else {
                res.json(contactsOfMy);
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// PUT: /invite/:userName  ->  send invite to contact
exports.send_invite = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        // Add to invite
        User.findOne({ 'profile.userName': req.params.userName }, (err, user) => {
            if (err) next(err);
            user.invites.unshift(req.headers.id);
            // save the updated document back to the database
            user.save((err) => {
                if (err) res.status(500).send(err);
                res.status(200).send({ success: true });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// PUT: /contact/:userName  ->  add the user to my contacts
exports.add_contact = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            User.findOne({ 'profile.userName': req.params.userName }, (err, user) => {
                if (err) next(err);

                // Create default personal chat
                var membersArray = [user._id, req.headers.id];
                var newChatMain = new ChatMain({
                    group: {
                        isGroup: false
                    },
                    members: membersArray
                });
                newChatMain.save((err) => { if (err) next(err); });

                var newChatReceiver = new ChatReceiver({
                    chatMain: newChatMain._id,
                    personal: {
                        isPersonal: true,
                        receiver: user._id,
                        profile: {
                            name: user.profile.firstName + ' ' + user.profile.lastName,
                            avatar: {
                                id: user.profile.avatar.id,
                                url: user.profile.avatar.url
                            }
                        }
                    },
                    sender: my._id
                });
                newChatReceiver.save((err) => { if (err) next(err); });

                // Add to me
                my.contacts.unshift({
                    user: user._id,
                    chat: newChatReceiver._id
                });
                my.chats.unshift(newChatReceiver._id);
                // save the updated document back to the database
                my.save((err) => { if (err) res.status(500).send(err); });


                // Add to contact
                var newChatReceiver = new ChatReceiver({
                    chatMain: newChatMain._id,
                    personal: {
                        isPersonal: true,
                        receiver: my._id,
                        profile: {
                            name: my.profile.firstName + ' ' + my.profile.lastName,
                            avatar: {
                                id: my.profile.avatar.id,
                                url: my.profile.avatar.url
                            }
                        }
                    },
                    sender: user._id
                });
                newChatReceiver.save((err) => { if (err) next(err); });

                user.contacts.unshift({
                    user: req.headers.id,
                    chat: newChatReceiver._id
                });
                user.chats.unshift(newChatReceiver._id);
                // save the updated document back to the database
                user.save((err) => {
                    if (err) res.status(500).send(err);
                    res.status(200).send({ success: true });
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// PUT: /avatar + body:{ image: file }  ->  update my avatar
exports.update_user_avatar = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        // Add to me
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            // FOR REFACTORING
            // // Delete old avatar on cloudinary
            // cloudinary.uploader.destroy(my.profile.avatar.low_id, (result) => {});
            // cloudinary.uploader.destroy(my.profile.avatar.high_id, (result) => {});

            // // Add new avatar on cloudinary
            // cloudinary.uploader.upload(req.files.low_image.path, (result) => {
            //     my.profile.avatar.low_url = result.url;
            //     my.profile.avatar.low_id = result.public_id;

            //     // Save the updated document back to the database
            //     my.save((err) => { if (err) res.status(500).send(err); });
            // });
            // cloudinary.uploader.upload(req.files.high_image.path, (result) => {
            //     my.profile.avatar.high_url = result.url;
            //     my.profile.avatar.high_id = result.public_id;

            //     my.save((err) => { if (err) res.status(500).send(err); });
            // });


            cloudinary.uploader.destroy(my.profile.avatar.id, (result) => {});
            cloudinary.uploader.upload(req.files.image.path, (result) => {
                my.profile.avatar.url = result.url;
                my.profile.avatar.id = result.public_id;

                // Save the updated document back to the database
                my.save((err) => {
                    if (err) res.status(500).send(err);
                    res.status(200).send(my.profile);
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// DELETE: /invite/:userName  ->  remove invite to contact
exports.delete_invite = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            User.findOne({ 'profile.userName': req.params.userName }, (err, user) => {
                if (err) next(err);

                // Remove to me
                my.invites.splice(my.invites.indexOf(user._id), 1);
                // save the updated document back to the database
                my.save((err) => {
                    if (err) res.status(500).send(err);
                    res.status(200).send({ success: true });
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// DELETE: /contact/:userName  ->  remove contact
exports.delete_contact = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            User.findOne({ 'profile.userName': req.params.userName }, (err, user) => {
                if (err) next(err);

                // Remove to me
                my.contacts.splice(my.contacts.indexOf(user._id), 1);
                // save the updated document back to the database
                my.save((err) => {
                    if (err) res.status(500).send(err);
                });

                // Remove to contact
                if (err) next(err);
                user.contacts.splice(user.contacts.indexOf(req.headers.id), 1);
                // save the updated document back to the database
                user.save((err) => {
                    if (err) res.status(500).send(err);
                    res.status(200).send({ success: true });
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};




/************************************/
/*           Bookmarks API          */
/************************************/
// GET: /bookmarks  ->  get all msgs (array of objects)
exports.get_bookmarks = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            var quantityBookmarks = my.bookmarks.length;
            var countBookmarks = 0;
            var bookmarksOfMy = [];

            if (quantityBookmarks > 0) {
                my.bookmarks.forEach((bookmark) => {
                    Msg.findOne(bookmark, (err, msg) => {
                        if (err) next(err);

                        bookmarksOfMy.push(msg);
                        countBookmarks++;

                        if (countBookmarks == quantityBookmarks) res.json(bookmarksOfMy);
                    });
                });
            } else {
                res.json(bookmarksOfMy);
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// GET: /bookmarks/:index  ->  (where :index from 0 to bookmarks.length/20) get top 20 msgs starting with 20*index
exports.get_bookmarks_by_index = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            var countBookmarks = 0;
            var bookmarksRangeMsg = [];
            var bookmarksRangeId = [];

            if (my.bookmarks.length > 0) {
                // Generate array of msgId to range
                for (var i = req.params.index * 20; i < (req.params.index * 20) + 20; i++) {
                    if (i < my.bookmarks.length) {
                        bookmarksRangeId.push(my.bookmarks[i]);
                    }
                }

                // Find and send <=20 msgs
                if (bookmarksRangeId.length > 0) {
                    bookmarksRangeId.forEach((bookmark) => {
                        Msg.findOne(bookmark, (err, msg) => {
                            if (err) next(err);

                            bookmarksRangeMsg.push(msg);
                            countBookmarks++;

                            if (countBookmarks == bookmarksRangeId.length) res.json(bookmarksRangeMsg);
                        });
                    });
                } else {
                    res.json(bookmarksRangeMsg);
                }
            } else {
                res.json(bookmarksRangeMsg);
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// PUT: /bookmarks + body:{ msgId[index]: msgId }  ->  add selected msgs to bookmarks
exports.add_bookmarks = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            for (var key in req.body) {
                my.bookmarks.unshift(req.body[key]);
            }

            // save the updated document back to the database
            my.save((err) => {
                if (err) res.status(500).send(err);
                res.status(200).send({ success: true });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// DELETE: /bookmarks + body:{ msgId[index]: msgId }  ->  remove msgs
exports.delete_bookmarks = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            for (var key in req.body) {
                my.bookmarks.splice(my.bookmarks.indexOf(req.body[key]), 1);
            }

            // save the updated document back to the database
            my.save((err) => {
                if (err) res.status(500).send(err);
                res.status(200).send({ success: true });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// DELETE: /bookmarks/history  ->  remove all msgs (and own objects of msgs)
exports.delete_history_bookmarks = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            my.bookmarks = [];

            // save the updated document back to the database
            my.save((err) => {
                if (err) res.status(500).send(err);
                res.status(200).send({ success: true });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};