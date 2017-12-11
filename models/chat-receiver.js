'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatReceiversSchema = new Schema({
    personal: {
        isPersonal: {
            type: Boolean
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
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
        }
    },
    chatMain: {
        type: Schema.Types.ObjectId,
        ref: 'ChatMain',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unread: {
        type: Number,
        default: 0
    },
    mute: {
        type: Boolean,
        default: false
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Msg'
    }]
});

module.exports = mongoose.model('ChatReceiver', ChatReceiversSchema);