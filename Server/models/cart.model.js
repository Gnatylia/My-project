const { Schema, model } = require("mongoose");


const CartSchema = new Schema({
   id_user: {
    type:{type: Schema.Types._id, ref: 'user'}
   },
   date_create: {
    type: Date,
    required: true,
    default: Date.now
   },
   isClosed: {
       type: Boolean,
       default: false
   }
})

const CartModel = model('Cart', CartSchema);

module.exports = {
    CartModel
} 