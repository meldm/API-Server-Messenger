'use strict';
var mongoose = require('mongoose');

// var fs = require("fs");

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
/*            Chat API              */
/************************************/
// GET: /chats  ->  get array of chats profiles (json with array of objects)
exports.get_chats = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            var quantityChats = my.chats.length;
            var countChats = 0;
            var chatsOfUser = [];

            if (quantityChats > 0) {
                my.chats.forEach((chat) => {
                    ChatReceiver.findOne(chat, (err, chatReceiver) => {
                        if (err) next(err);

                        ChatMain.findOne(chatReceiver.chatMain, (err, chatMain) => {
                            if (err) next(err);

                            // if personal (one to one) chat
                            if (chatReceiver.personal.isPersonal && chatReceiver.messages.length != 0) {
                                User.findById(chatReceiver.personal.receiver, (err, user) => {
                                    if (err) next(err);

                                    // Check and Updating avatar and name of personal (one to one) chat
                                    if (user.profile.firstName + ' ' + user.profile.lastName != chatReceiver.personal.profile.name) {
                                        chatReceiver.personal.profile.name = user.profile.firstName + ' ' + user.profile.lastName;
                                        updateChat(chatReceiver._id, chatReceiver);
                                    }
                                    if (user.profile.avatar.id != chatReceiver.personal.profile.avatar.id) {
                                        chatReceiver.personal.profile.avatar.id = user.profile.avatar.id;
                                        chatReceiver.personal.profile.avatar.url = user.profile.avatar.url;
                                        updateChat(chatReceiver._id, chatReceiver);
                                    }

                                    getMsg(chatReceiver.messages[0]).then((msg) => {
                                        if (msg != null) {
                                            getUser(msg.sender).then((sender) => {
                                                var chatJSON = {
                                                    _id: chatReceiver._id,
                                                    isGroup: false,
                                                    profile: {
                                                        name: user.profile.firstName + ' ' + user.profile.lastName,
                                                        avatar: {
                                                            id: user.profile.avatar.id,
                                                            url: user.profile.avatar.url
                                                        }
                                                    },
                                                    sender: chatReceiver.sender,
                                                    members: chatMain.members.length,
                                                    lastMessage: {
                                                        _id: msg._id,
                                                        sender: sender.profile.firstName,
                                                        date: msg.date,
                                                        body: {
                                                            content: msg.body.content,
                                                            type: msg.body.type
                                                        }
                                                    },
                                                    unread: chatReceiver.unread,
                                                    mute: chatReceiver.mute
                                                };
                                                chatsOfUser.unshift(chatJSON);
                                                countChats++;

                                                if (countChats == quantityChats) res.json(chatsOfUser);
                                            });
                                        } else {
                                            var chatJSON = {
                                                _id: chatReceiver._id,
                                                isGroup: false,
                                                profile: {
                                                    name: user.profile.firstName + ' ' + user.profile.lastName,
                                                    avatar: {
                                                        id: user.profile.avatar.id,
                                                        url: user.profile.avatar.url
                                                    }
                                                },
                                                sender: chatReceiver.sender,
                                                members: chatMain.members.length,
                                                lastMessage: msg,
                                                unread: chatReceiver.unread,
                                                mute: chatReceiver.mute
                                            };
                                            chatsOfUser.unshift(chatJSON);
                                            countChats++;

                                            if (countChats == quantityChats) res.json(chatsOfUser);
                                        }
                                    });
                                });
                            }
                            if (chatReceiver.personal.isPersonal && chatReceiver.messages.length == 0) {
                                countChats++;

                                if (countChats == quantityChats) res.json(chatsOfUser);
                            }

                            //if group chat
                            if (chatMain.group.isGroup) {
                                getMsg(chatReceiver.messages[0]).then((msg) => {
                                    if (msg != null) {
                                        getUser(msg.sender).then((sender) => {
                                            var chatJSON = {
                                                _id: chatReceiver._id,
                                                isGroup: true,
                                                profile: {
                                                    name: chatMain.group.profile.name,
                                                    avatar: {
                                                        id: chatMain.group.profile.avatar.id,
                                                        url: chatMain.group.profile.avatar.url
                                                    }
                                                },
                                                sender: chatReceiver.sender,
                                                members: chatMain.members.length,
                                                lastMessage: {
                                                    _id: msg._id,
                                                    sender: sender.profile.firstName,
                                                    date: msg.date,
                                                    body: {
                                                        content: msg.body.content,
                                                        type: msg.body.type
                                                    }
                                                },
                                                unread: chatReceiver.unread,
                                                mute: chatReceiver.mute
                                            };

                                            chatsOfUser.unshift(chatJSON);
                                            countChats++;

                                            if (countChats == quantityChats) res.json(chatsOfUser);
                                        });
                                    } else {
                                        var chatJSON = {
                                            _id: chatReceiver._id,
                                            isGroup: true,
                                            profile: {
                                                name: chatMain.group.profile.name,
                                                avatar: {
                                                    id: chatMain.group.profile.avatar.id,
                                                    url: chatMain.group.profile.avatar.url
                                                }
                                            },
                                            sender: chatReceiver.sender,
                                            members: chatMain.members.length,
                                            lastMessage: msg,
                                            unread: chatReceiver.unread,
                                            mute: chatReceiver.mute
                                        };

                                        chatsOfUser.unshift(chatJSON);
                                        countChats++;

                                        if (countChats == quantityChats) res.json(chatsOfUser);
                                    }
                                });
                            }
                        });
                    });
                });
            } else {
                res.json(chatsOfUser);
            }

        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

function updateChat(id, body) {
    ChatReceiver.findByIdAndUpdate(id, body, (err) => { if (err) res.send(err); });
};

function getMsg(id) {
    return Msg.findById(id).exec((err, msg) => {
        if (err) next(err);

        return msg;
    })
};

function getUser(id) {
    return User.findById(id).exec((err, user) => {
        if (err) next(err);

        return user;
    })
};

// GET: /chat/:chatId  ->  get chat
exports.get_chat = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                // Generate array members profile
                var membersProfileArray = [];
                var countMembers = 0;
                chatMain.members.forEach((userId) => {
                    User.findById(userId, (err, user) => {
                        if (err) next(err);

                        console.log(chatMain);

                        membersProfileArray.push(user.profile);
                        countMembers++;

                        if (countMembers == chatMain.members.length) {
                            // if personal (one to one) chat
                            if (chatReceiver.personal.isPersonal) {
                                if (chatReceiver.messages.length > 0) {
                                    // Generate array of msgs
                                    var msgsArray = [];
                                    var countMsgs = 0;

                                    chatReceiver.messages.forEach((msgId) => {
                                        Msg.findOne(msgId, (err, msg) => {
                                            if (err) next(err);

                                            msgsArray.push(msg);
                                            countMsgs++;

                                            if (countMsgs == chatReceiver.messages.length) {

                                                // Create full chat JSON
                                                var chatJSON = {
                                                    _id: chatReceiver._id,
                                                    isGroup: false,
                                                    profile: {
                                                        name: chatReceiver.personal.profile.name,
                                                        avatar: {
                                                            id: chatReceiver.personal.profile.avatar.id,
                                                            url: chatReceiver.personal.profile.avatar.url
                                                        }
                                                    },
                                                    sender: chatReceiver.sender,
                                                    members: membersProfileArray,
                                                    unread: chatReceiver.unread,
                                                    mute: chatReceiver.mute,
                                                    messages: msgsArray
                                                };

                                                res.json(chatJSON);
                                            }
                                        });
                                    });

                                } else {
                                    // Create full chat JSON
                                    var chatJSON = {
                                        _id: chatReceiver._id,
                                        isGroup: false,
                                        profile: {
                                            name: chatReceiver.personal.profile.name,
                                            avatar: {
                                                id: chatReceiver.personal.profile.avatar.id,
                                                url: chatReceiver.personal.profile.avatar.url
                                            }
                                        },
                                        sender: chatReceiver.sender,
                                        members: membersProfileArray,
                                        unread: chatReceiver.unread,
                                        mute: chatReceiver.mute,
                                        messages: []
                                    };

                                    res.json(chatJSON);
                                }
                            } else { // if group chat
                                if (chatReceiver.messages.length > 0) {
                                    // Generate array of msgs
                                    var msgsArray = [];
                                    var countMsgs = 0;

                                    chatReceiver.messages.forEach((msgId) => {
                                        Msg.findOne(msgId, (err, msg) => {
                                            if (err) next(err);

                                            msgsArray.push(msg);
                                            countMsgs++;

                                            if (countMsgs == chatReceiver.messages.length) {

                                                // Create full chat JSON
                                                var chatJSON = {
                                                    _id: chatReceiver._id,
                                                    isGroup: true,
                                                    profile: {
                                                        name: chatMain.group.profile.name,
                                                        avatar: {
                                                            id: chatMain.group.profile.avatar.id,
                                                            url: chatMain.group.profile.avatar.url
                                                        }
                                                    },
                                                    sender: chatReceiver.sender,
                                                    members: membersProfileArray,
                                                    unread: chatReceiver.unread,
                                                    mute: chatReceiver.mute,
                                                    messages: msgsArray
                                                };

                                                res.json(chatJSON);
                                            }
                                        });
                                    });

                                } else {
                                    // Create full chat JSON
                                    var chatJSON = {
                                        _id: chatReceiver._id,
                                        isGroup: true,
                                        profile: {
                                            name: chatMain.group.profile.name,
                                            avatar: {
                                                id: chatMain.group.profile.avatar.id,
                                                url: chatMain.group.profile.avatar.url
                                            }
                                        },
                                        sender: chatReceiver.sender,
                                        members: membersProfileArray,
                                        unread: chatReceiver.unread,
                                        mute: chatReceiver.mute,
                                        messages: []
                                    };

                                    res.json(chatJSON);
                                }
                            }
                        }
                    });
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// GET: /chat/:chatId/:index  ->  (where :index from 0 to chats.length/20) get top 20 msgs starting with 20*index
exports.get_chat_by_index = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                // if one to one 
                if (chatReceiver.personal.isPersonal) {
                    var countMsgs = 0;
                    var rangeMsg = [];
                    var rangeId = [];

                    if (chatReceiver.messages.length > 0) {
                        // Generate array of msgId to range
                        for (var i = req.params.index * 20; i < (req.params.index * 20) + 20; i++) {
                            if (i < chatReceiver.messages.length) {
                                rangeId.push(chatReceiver.messages[i]);
                            }
                        }

                        // Find and send <=20 msgs
                        if (rangeId.length > 0) {
                            rangeId.forEach((msgId) => {
                                Msg.findOne(msgId, (err, msg) => {
                                    if (err) next(err);

                                    rangeMsg.push(msg);
                                    countMsgs++;

                                    if (countMsgs == rangeId.length) {
                                        var chatJSON = {
                                            _id: chatReceiver._id,
                                            isGroup: false,
                                            profile: {
                                                name: chatReceiver.personal.profile.name,
                                                avatar: {
                                                    id: chatReceiver.personal.profile.avatar.id,
                                                    url: chatReceiver.personal.profile.avatar.url
                                                }
                                            },
                                            sender: chatReceiver.sender,
                                            unread: chatReceiver.unread,
                                            mute: chatReceiver.mute,
                                            messages: rangeMsg
                                        };

                                        res.json(chatJSON);
                                    }
                                });
                            });
                        } else {
                            var chatJSON = {
                                _id: chatReceiver._id,
                                isGroup: false,
                                profile: {
                                    name: chatReceiver.personal.profile.name,
                                    avatar: {
                                        id: chatReceiver.personal.profile.avatar.id,
                                        url: chatReceiver.personal.profile.avatar.url
                                    }
                                },
                                sender: chatReceiver.sender,
                                unread: chatReceiver.unread,
                                mute: chatReceiver.mute,
                                messages: []
                            };

                            res.json(chatJSON);
                        }
                    } else {
                        var chatJSON = {
                            _id: chatReceiver._id,
                            isGroup: false,
                            profile: {
                                name: chatReceiver.personal.profile.name,
                                avatar: {
                                    id: chatReceiver.personal.profile.avatar.id,
                                    url: chatReceiver.personal.profile.avatar.url
                                }
                            },
                            sender: chatReceiver.sender,
                            unread: chatReceiver.unread,
                            mute: chatReceiver.mute,
                            messages: []
                        };

                        res.json(chatJSON);
                    }
                } else { // if group chat
                    // Generate array members profile
                    var membersProfileArray = [];
                    var countMembers = 0;

                    chatMain.members.forEach((userId) => {
                        User.findById(userId, (err, user) => {
                            if (err) next(err);

                            membersProfileArray.push(user.profile);
                            countMembers++;

                            if (countMembers == chatMain.members.length) {
                                var countMsgs = 0;
                                var rangeMsg = [];
                                var rangeId = [];

                                if (chatReceiver.messages.length > 0) {
                                    // Generate array of msgId to range
                                    for (var i = req.params.index * 20; i < (req.params.index * 20) + 20; i++) {
                                        if (i < chatReceiver.messages.length) {
                                            rangeId.push(chatReceiver.messages[i]);
                                        }
                                    }

                                    // Find and send <=20 msgs
                                    if (rangeId.length > 0) {
                                        rangeId.forEach((msgId) => {
                                            Msg.findOne(msgId, (err, msg) => {
                                                if (err) next(err);

                                                rangeMsg.push(msg);
                                                countMsgs++;

                                                if (countMsgs == rangeId.length) {
                                                    var chatJSON = {
                                                        _id: chatReceiver._id,
                                                        isGroup: true,
                                                        profile: {
                                                            name: chatMain.group.profile.name,
                                                            avatar: {
                                                                id: chatMain.group.profile.avatar.id,
                                                                url: chatMain.group.profile.avatar.url
                                                            }
                                                        },
                                                        sender: chatReceiver.sender,
                                                        members: membersProfileArray,
                                                        unread: chatReceiver.unread,
                                                        mute: chatReceiver.mute,
                                                        messages: rangeMsg
                                                    };

                                                    res.json(chatJSON);
                                                }
                                            });
                                        });
                                    } else {
                                        var chatJSON = {
                                            _id: chatReceiver._id,
                                            isGroup: true,
                                            profile: {
                                                name: chatMain.group.profile.name,
                                                avatar: {
                                                    id: chatMain.group.profile.avatar.id,
                                                    url: chatMain.group.profile.avatar.url
                                                }
                                            },
                                            sender: chatReceiver.sender,
                                            members: membersProfileArray,
                                            unread: chatReceiver.unread,
                                            mute: chatReceiver.mute,
                                            messages: []
                                        };

                                        res.json(chatJSON);
                                    }
                                } else {
                                    var chatJSON = {
                                        _id: chatReceiver._id,
                                        isGroup: true,
                                        profile: {
                                            name: chatMain.group.profile.name,
                                            avatar: {
                                                id: chatMain.group.profile.avatar.id,
                                                url: chatMain.group.profile.avatar.url
                                            }
                                        },
                                        sender: chatReceiver.sender,
                                        members: membersProfileArray,
                                        unread: chatReceiver.unread,
                                        mute: chatReceiver.mute,
                                        messages: []
                                    };

                                    res.json(chatJSON);
                                }

                            }
                        });
                    });

                }
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// POST: /chat + body:{ userName[index]: userName }  ->  create new group chat or personal (one to one)
exports.create_chat = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {

        var membersUserNameArr = [];

        User.findById(req.headers.id, (err, my) => {
            if (err) next(err);

            for (var key in req.body) {
                membersUserNameArr.push(req.body[key]);
            }
            membersUserNameArr.push(my.profile.userName);


            var chatName = "";
            var membersUserIdArr = [];
            var countMembers = 0;

            for (var index = 0; index < membersUserNameArr.length; index++) {
                User.findOne({ 'profile.userName': membersUserNameArr[index] }, (err, member) => {
                    if (err) next(err);

                    membersUserIdArr.push(member._id);
                    countMembers++;

                    if (membersUserIdArr.length == membersUserNameArr.length) {

                        var chatName = "";
                        var countMembers = 0;



                        // create new chat main
                        var newChatMain = new ChatMain({
                            group: {
                                isGroup: true
                            },
                            members: membersUserIdArr
                        });
                        // and save the chat
                        newChatMain.save((err) => {
                            if (err) res.status(500).send(err);
                            res.status(200).send({ success: true });
                        });



                        membersUserIdArr.forEach((userId) => {
                            User.findById(userId, (err, user) => {
                                if (err) next(err);

                                chatName += user.profile.firstName + ', ';
                                countMembers++;

                                var newChatReceiver = new ChatReceiver({
                                    personal: {
                                        isPersonal: false
                                    },
                                    chatMain: newChatMain._id,
                                    sender: user._id
                                });
                                // and save the chat
                                newChatReceiver.save((err) => { if (err) res.status(500).send(err); });

                                user.chats.unshift(newChatReceiver._id);
                                user.save((err) => { if (err) res.status(500).send(err); });


                                if (countMembers == membersUserIdArr.length) {

                                    // fix chat name
                                    chatName = chatName.substring(0, chatName.length - 2);

                                    newChatMain.group.profile.name = chatName;
                                    newChatMain.save((err) => { if (err) res.status(500).send(err); });
                                }
                            });
                        });
                    }
                });
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// PUT: /chat/:chatId/members + body:{ userName[index]: userName }  ->  add new members in the group chat
exports.add_chat_members = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                if (chatMain.group.isGroup) {
                    // Generate new members userName array
                    var newMembersUserNameArray = []
                    for (var key in req.body) {
                        newMembersUserNameArray.push(req.body[key]);
                    }

                    var countMembers = 0;
                    newMembersUserNameArray.forEach((userName) => {
                        User.findOne({ 'profile.userName': userName }, (err, user) => {
                            if (err) next(err);

                            // Create new chat receiver
                            var newChatReceiver = new ChatReceiver({
                                personal: {
                                    isPersonal: false
                                },
                                chatMain: chatMain._id,
                                sender: user._id,
                                messages: chatMain.group.messages
                            });
                            newChatReceiver.save((err) => { if (err) res.status(500).send(err); });

                            user.chats.unshift(newChatReceiver._id);
                            user.save((err) => { if (err) res.status(500).send(err); });

                            chatMain.members.push(user._id);
                            countMembers++;

                            if (countMembers == newMembersUserNameArray.length) {
                                chatMain.save((err) => {
                                    if (err) res.status(500).send(err);
                                    res.status(200).send({ success: true });
                                });
                            }
                        });
                    });

                }
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// PUT: /chat/:chatId/name + body:{ name: newName }  ->  update name of the chat
exports.update_chat_name = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                if (chatMain.group.isGroup) {
                    chatMain.group.profile.name = req.body.name;
                    chatMain.save((err) => {
                        if (err) res.status(500).send(err);
                        res.status(200).send({ success: true });
                    });
                }
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// PUT: /chat/:chatId/avatar + body:{ image: file }  ->  update avatar in chat
exports.update_chat_avatar = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                if (chatMain.group.isGroup) {
                    // Delete old avatar on cloudinary
                    cloudinary.uploader.destroy(chatMain.group.profile.avatar.id, (result) => {});

                    // Add new avatar on cloudinary
                    cloudinary.uploader.upload(req.files.image.path, (result) => {
                        chatMain.group.profile.avatar.url = result.url;
                        chatMain.group.profile.avatar.id = result.public_id;

                        // Save the updated document back to the database
                        chatMain.save((err) => {
                            if (err) res.status(500).send(err);
                            res.status(200).send(chatMain.group.profile.avatar.url);
                        });
                    });
                }
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// DELETE: /chat/:chatId  ->  leave group chat
exports.delete_chat = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                if (chatMain.group.isGroup) {
                    User.findById(req.headers.id, (err, my) => {
                        if (err) next(err);

                        // Delete chat receiver
                        my.chats.splice(my.chats.indexOf(chatReceiver._id), 1);
                        my.save((err) => { if (err) res.status(500).send(err); });

                        chatMain.members.splice(chatMain.members.indexOf(my._id), 1);
                        chatMain.save((err) => { if (err) res.status(500).send(err); });

                        chatReceiver.remove((err) => {
                            if (err) res.status(500).send(err);
                            res.status(200).send({ success: true });
                        });
                    });
                }
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// DELETE: /chat/:chatId/history  ->  remove all msgs (clear history)
exports.delete_chat_history = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            chatReceiver.messages = [];
            chatReceiver.save((err) => {
                if (err) res.status(500).send(err);
                res.status(200).send({ success: true });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// DELETE: /chat/:chatId/msgs + body:{ msgId[index]: msgId }  ->  remove select (array) msgs
exports.delete_chat_msgs = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            for (var key in req.body) {
                chatReceiver.messages.splice(chatReceiver.messages.indexOf(req.body[key]), 1);
            }

            chatReceiver.save((err) => {
                if (err) res.status(500).send(err);
                res.status(200).send({ success: true });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};

// DELETE: /chat/:chatId/members + body:{ userName[index]: userName }  ->  remove members
exports.delete_chat_members = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                if (chatMain.group.isGroup) {
                    // Generate members userName array
                    var newMembersUserNameArray = []
                    for (var key in req.body) {
                        newMembersUserNameArray.push(req.body[key]);
                    }

                    var countMembers = 0;
                    newMembersUserNameArray.forEach((userName) => {
                        User.findOne({ 'profile.userName': userName }, (err, user) => {
                            if (err) next(err);

                            // Delete chat receiver
                            ChatReceiver.findOne({ 'sender': user._id, 'chatMain': chatMain._id }, (err, chat) => {
                                if (err) next(err);

                                user.chats.splice(user.chats.indexOf(chat._id), 1);
                                user.save((err) => { if (err) res.status(500).send(err); });

                                chatMain.members.splice(chatMain.members.indexOf(user._id), 1);
                                chatMain.save((err) => { if (err) res.status(500).send(err); });

                                chat.remove((err) => { if (err) res.status(500).send(err); });
                            });

                            countMembers++;

                            if (countMembers == newMembersUserNameArray.length) {
                                res.status(200).send({ success: true });
                            }
                        });
                    });

                }
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};