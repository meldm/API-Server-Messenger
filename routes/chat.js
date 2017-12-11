'use strict';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var Chat = require('../controllers/chat');


module.exports = function(app) {
    /************************************/
    /*            Chat API              */
    /************************************/
    // GET: /chats  ->  get array of chats profiles (json with array of objects)
    app.get('/chats', Chat.get_chats);
    // GET: /chat/:chatId  ->  get full chat information with all msgs (array of objects)
    app.get('/chat/:chatId', Chat.get_chat);
    // GET: /chat/:chatId/:index  ->  (where :index from 0 to chats.length/20) get top 20 msgs starting with 20*index
    app.get('/chat/:chatId/:index', Chat.get_chat_by_index);

    // POST: /chat + body:{ userName[index]: userName }  ->  create new group chat
    app.post('/chat', Chat.create_chat);

    // PUT: /chat/:chatId/members + body:{  userName[index]: userName }  ->  add new members in the group chat
    app.put('/chat/:chatId/members', Chat.add_chat_members);
    // PUT: /chat/:chatId/name + body:{ name: newName }  ->  update name of the group chat
    app.put('/chat/:chatId/name', Chat.update_chat_name);
    // PUT: /chat/:chatId/avatar + body:{ image: file }  ->  update avatar in the group chat
    app.put('/chat/:chatId/avatar', multipartMiddleware, Chat.update_chat_avatar);

    // DELETE: /chat/:chatId  ->  leave group chat and remove from my chats
    app.put('/chat/:chatId', Chat.delete_chat);
    // DELETE: /chat/:chatId/history  ->  remove all msgs (clear history)
    app.put('/chat/:chatId/history', Chat.delete_chat_history);
    // DELETE: /chat/:chatId/msgs + body:{ msgId[index]: msgId }  ->  remove select (array) msgs
    app.put('/chat/:chatId/msgs', Chat.delete_chat_msgs);
    // DELETE: /chat/:chatId/members + body:{ userName[index]: userName }  ->  remove members
    app.put('/chat/:chatId/members/delete', Chat.delete_chat_members);
};