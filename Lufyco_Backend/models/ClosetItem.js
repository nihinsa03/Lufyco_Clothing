const mongoose = require('mongoose');

const closetItemSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String, // URL or base64
            required: true,
        },
        notes: {
            type: String,
            required: false,
        },
        color: {
            type: String,
            required: false,
            default: '#000000',
        },
        featureVector: {
            type: [Number],
            default: [],
        },
        occasion:{
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const ClosetItem = mongoose.model('ClosetItem', closetItemSchema);

module.exports = ClosetItem;
