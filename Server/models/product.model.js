const { Schema, model } = require("mongoose");
const { CategoryModel } = require("../models/category.model");


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    img:{
        type:String,
        required: true
    },
    id_category:{
        type:{type: Schema.Types.id, ref: 'Category'}
    }
})

const ProductModel = model('Product', productSchema);

module.exports = {
    ProductModel,
} 


