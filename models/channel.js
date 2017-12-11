'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChannelMainSchema = new Schema({
    profile: {
        channelName: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
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
        },
        admins: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Msg'
    }]
});

var ChannelFollowerSchema = new Schema({
    channel: {
        type: Schema.Types.ObjectId,
        ref: 'ChannelMain',
        required: true
    },
    unread: {
        type: Number,
        default: 0
    },
    mute: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ChannelMain', ChannelMainSchema);
module.exports = mongoose.model('ChannelFollower', ChannelFollowerSchema);