const { default: mongoose, Schema } = require("mongoose");
const db = require("../config/connection")
const wishSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
    },
    Items: [{
        productId: {

            type: mongoose.Types.ObjectId,
            ref: "products"
        }
    }]

})
module.exports = mongoose.model('WishList', wishSchema);



