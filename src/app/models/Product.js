const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, required: true}
},{
    timestamps: true
})

const productSchema = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    price: { type: Number },
    rating: { type: Number },
    image: { type: String },
    comments:  [commentSchema],
    active: { type: Boolean, default: true },
}, {
    timestamps: true
});


module.exports = mongoose.model('Product', productSchema);
