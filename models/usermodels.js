const { default: mongoose } = require("mongoose");
const db = require("../config/connection")
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    mobile: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    userStatus: {
        type: Boolean,
        default: true
    }
})
module.exports = mongoose.model('user', userSchema);