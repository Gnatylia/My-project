const { Schema, model } = require("mongoose");


const CartItemSchema = new Schema({
    id_product: {
        type: { type: Schema.Types._id, ref: 'Product' }
    },
    amount: {
        type: Number,
        required: true
    },
    origin_price: {
        type: Number,
        required: true
    },
    id_cart: {
        type: { type: Schema.Types._id, ref: 'Cart' }
    }
})

const CartItemModel = model('CartItem', CartItemSchema);

module.exports = {
    CartItemModel
} 