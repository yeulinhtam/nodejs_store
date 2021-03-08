const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, required: true}
}, {
    timestamps: true
});


module.exports = mongoose.model('Comment', commentSchema);