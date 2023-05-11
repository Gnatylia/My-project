const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const CategoryModel = model('Category', categorySchema);

module.exports = {
    CategoryModel
} 