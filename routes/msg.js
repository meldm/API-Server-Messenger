'use strict';
var Msg = require('../controllers/msg');

module.exports = function(app, io) {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('msg', (chat) => {
            // io.sockets.in(chat).emit('refresh messages', chat);
            console.log(chat);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    /************************************/
    /*             Msg API              */
    /************************************/
    // POST: /msg/chat/:chatId + body:{ msg: msgBody }  ->  send new msg
    app.post('/msg/chat/:chatId', Msg.create_chat_msg);
    // POST: /msg/group/:groupId + body:{ msg: msgBody }  ->  send new msg
    // app.post('/msg/group/:groupId', Msg.create_group_msg);
    // POST: /msg/channel/:channelId + body:{ msg: msgBody }  ->  send new msg
    // app.post('/msg/channel/:channelId', Msg.create_channel_msg);


    // PUT: /msgs + body:{ msgId[index]: msgId, chatId[index]: chatId | groupId[index]: groupId | channelId[index]: channelId }  ->  forward select (array) msgs
    app.put('/msgs', Msg.forward_msgs);


    // DELETE: /msgs + body:{ msgId[index]: msgId }  ->  remove select (array) msgs everywhere (if author)
    app.delete('/msgs', Msg.delete_msgs);
};