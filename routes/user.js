'use strict';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var User = require('../controllers/user');

module.exports = function(app) {
    /************************************/
    /*             User API             */
    /************************************/
    // GET: /users
    app.get('/users', User.get_users);

    // GET: /my  ->   get my user profile
    app.get('/my', User.get_my_profile);
    // GET: /user/:userName  ->  get user profile by userName
    app.get('/user/:userName', User.get_user_profile);
    // GET: /invites  ->  get array of invites profiles
    app.get('/invites', User.get_invites);
    // GET: /contacts  ->  get array of contacts profiles (json with array of objects)
    app.get('/contacts', User.get_contacts);


    // PUT: /my + body:{ ... }  ->  update my data
    // app.put('/my', User.update_my);
    // PUT: /my/check/userName + body:{ profile.userName: newUserName }  ->  check new userName
    // app.put('/my/check/userName', User.check_username);
    // PUT: /invite/:userName  ->  send invite to contact
    app.put('/invite/:userName', User.send_invite);
    // PUT: /contact/:userName  ->  add the user to my contacts
    app.put('/contact/:userName', User.add_contact);
    // PUT: /avatar + body:{ image: file }  ->  update my avatar
    app.put('/avatar', multipartMiddleware, User.update_user_avatar);
    // PUT: /status
    // app.put('/status', User.update_status);
    // PUT: /logout
    // app.put('/logout', User.logout);


    // DELETE: /invite/:userName  ->  remove invite to contact
    app.delete('/invite/:userName', User.delete_invite);
    // DELETE: /contact/:userName  ->  remove contact
    app.delete('/contact/:userName', User.delete_contact);



    /************************************/
    /*           Bookmarks API          */
    /************************************/
    // GET: /bookmarks  ->  get all msgs (array of objects)
    app.get('/bookmarks', User.get_bookmarks);
    // GET: /bookmarks/:index  ->  (where :index from 0 to bookmarks.length/20) get top 20 msgs starting with 20*index
    app.get('/bookmarks/:index', User.get_bookmarks_by_index);

    // PUT: /bookmarks + body:{ msgId[index]: msgId }  ->  add selected msgs to bookmarks
    app.put('/bookmarks', User.add_bookmarks);

    // DELETE: /bookmarks + body:{ msgId[index]: msgId }  ->  remove msgs
    app.put('/bookmarks/msgs', User.delete_bookmarks);
    // DELETE: /bookmarks/history  ->  remove all msgs (and own objects of msgs)
    app.put('/bookmarks/history', User.delete_history_bookmarks);
};