'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const MsgSchema = new Schema({
    body: {
        type: {
            type: String,
            enum: ['text', 'image', 'forwardMsg', 'file', 'contact', 'location'],
            default: 'text'
        },
        content: {
            type: String,
            required: true
        }
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('Msg', MsgSchema);