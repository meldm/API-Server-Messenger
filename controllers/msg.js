'use strict';
var mongoose = require('mongoose');

var Auth = require('../controllers/auth');
var User = require('../models/user');
var ChatMain = require('../models/chat-main');
var ChatReceiver = require('../models/chat-receiver');
var Msg = require('../models/msg');


/************************************/
/*             Msg API              */
/************************************/
// POST: /msg/chat/:chatId + body:{ msg: msgBody }  ->  send new msg
exports.create_chat_msg = (req, res) => {
    var token = Auth.getToken(req.headers);
    if (token) {
        ChatReceiver.findById(req.params.chatId, (err, chatReceiver) => {
            if (err) next(err);

            ChatMain.findById(chatReceiver.chatMain, (err, chatMain) => {
                if (err) next(err);

                // Create new msg
                var newMsg = new Msg({
                    body: {
                        content: req.body.msg
                    },
                    sender: req.headers.id
                });
                newMsg.save((err) => {
                    if (err) res.status(500).send(err);
                    res.status(200).send(newMsg._id);
                });

                // For main chat
                chatMain.group.messages.unshift(newMsg._id);
                chatMain.save((err) => { if (err) res.status(500).send(err); });

                // For each receivers with to me
                ChatReceiver.find({ chatMain: chatReceiver.chatMain }, { multi: true }, (err, chatsReceivers) => {
                    if (err) next(err);

                    for (var i in chatsReceivers) {
                        ChatReceiver.findById(chatsReceivers[i]._id, (err, chat) => {
                            if (err) next(err);

                            // update chat
                            chat.messages.unshift(newMsg._id);
                            if (chat._id != req.params.chatId) {
                                chat.unread = chat.unread + 1;
                            }
                            chat.save((err) => { if (err) res.status(500).send(err); });
                        });
                    }
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized!' });
    }
};



// PUT: /msgs + body:{ msgId[index]: msgId, chatId[index]: chatId | groupId[index]: groupId | channelId[index]: channelId }  ->  forward select (array) msgs
exports.forward_msgs = (req, res) => {

};



// DELETE: /msgs + body:{ msgId[index]: msgId }  ->  remove select (array) msgs everywhere (if author)
exports.delete_msgs = (req, res) => {

};