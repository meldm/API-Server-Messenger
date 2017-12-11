'use strict';
var Auth = require('../controllers/auth');

module.exports = function(app) {
    app.post('/signin', Auth.signin);

    app.post('/signup', Auth.signup);
};