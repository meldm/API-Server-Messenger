'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatMainSchema = new Schema({
    group: {
        isGroup: {
            type: Boolean
        },
        profile: {
            name: {
                type: String
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
            }
        },
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'Msg'
        }]
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('ChatMain', ChatMainSchema);