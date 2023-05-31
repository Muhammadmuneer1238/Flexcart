const { default: mongoose, Schema } = require("mongoose");
const db = require("../config/connection")
const couponSchema = new mongoose.Schema({
    couponId:{
        type:String
    },
    expiryDate:{
        type:Date
    },
    percentage:{
        type:Number
    },
    maxAmount:{
        type:Number
    },
    message:{
        type:String
    }
   
})
module.exports = mongoose.model('coupon', couponSchema);



