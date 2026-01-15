const mongoose = require('mongoose');

const closetItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Make it optional for now if strict auth isn't enforced
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
        }
    },
    {
        timestamps: true,
    }
);

const ClosetItem = mongoose.model('ClosetItem', closetItemSchema);

module.exports = ClosetItem;
