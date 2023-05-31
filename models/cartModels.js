const { default: mongoose, Schema } = require("mongoose");
const db = require("../config/connection")
const cartSchema = new mongoose.Schema({
    cartProduct: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number
        }
    }],

    userId: {
        type: mongoose.Types.ObjectId,
        required:true
    }
})
module.exports= mongoose.model('carts',cartSchema);



