const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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
    role: {
        type: String,
        required: true,
        default: "user"
    },
    email: {
        type: String,
        required: true
    },
})

const UserModel = model('user', userSchema);

module.exports = {
    UserModel
} 