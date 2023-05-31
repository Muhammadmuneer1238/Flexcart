const { default: mongoose, Schema } = require("mongoose");
const db = require("../config/connection");
const Mail = require("nodemailer/lib/mailer");
const addressSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
       
            },
    userAddress: [{
        fname: {

            type: String,
            required: true

        },
        lname: {
            type: String,
            required: true
        },
        country: {
            type: String,

        },
        house: {
            type: String,
        },
        pincode: {
            type: Number,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        status:{
            type:Boolean,
            default:false
        }

    }]

})
module.exports = mongoose.model('address', addressSchema);



