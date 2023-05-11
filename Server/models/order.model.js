const { Schema, model } = require("mongoose");


const OrderSchema = new Schema({
    id_user: {
        type: { type: Schema.Types._id, ref: 'user' }
    },
    sum: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    date_send: {
        type: Date,
        required: true
    },
    date_order: {
        type: Date,
        required: true,
        default: Date.now
    },
    id_cart: {
        type: { type: Schema.Types._id, ref: 'Cart' }
    },
    credit_card:{
        type: Number,
        required:true
    }
})

const OrderModel = model('Order', OrderSchema);

module.exports = {
    OrderModel
}