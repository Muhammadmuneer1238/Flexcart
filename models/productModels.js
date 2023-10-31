const { default: mongoose } = require("mongoose");
const db = require("../config/connection")
var productSchema =new mongoose.Schema({

    productname: {
        type: String,
        required:true
    },
    ProdDesc: {
        type: String,
    },

   brand : {
        type:String
    },

    price:{
       type:String,
       required:true 
    },
    mycategory :{
        type:String
    },
    images:{
        type:Array
    }

})

module.exports= mongoose.model('products',productSchema);