const { default: mongoose ,Schema} = require("mongoose");
const db = require("../config/connection")
var adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('admin', adminSchema);