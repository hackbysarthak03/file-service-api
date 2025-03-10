const { required } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        default: Date.now
    },
    // You can use this field specifically for TTL expiration
    expiresAt: {
        type: Date,
        required:true
    }
})

// Create a TTL index on the expiresAt field
FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const FileModel = mongoose.model('files', FileSchema)
module.exports = FileModel;