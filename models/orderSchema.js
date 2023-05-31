const { default: mongoose ,Schema} = require("mongoose");
const db = require("../config/connection");
var orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId

    },
    OrderAddress:
        {
            fname: {
                type: String,
                required: true


            },
            lname: {
                type: String,
                required: true

            },
            country: {
                type: String

            },
            street: {
                type: String
            },
            town: {
                type: String
            },
            state: {
                type: String
            },
            pincode: {
                type: Number
            },
            mobile: {
                type: Number,
                required: true

            },
            email: {
                type: String,
                required: true

            },
            message: {
                type: String
            },
            total: {
                type: Number,
                required: true
            },
            method: {
                type: String,
                required:true

            },
            date: {
                type: Date

            },
            status:
            {
                type: String
            },
        },
    
    cart:
        [{

            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'product'


            },
            quantity: {
                type: Number
            },


        }]



})

module.exports = mongoose.model('order', orderSchema);