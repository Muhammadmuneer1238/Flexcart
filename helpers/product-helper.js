const db = require("../config/connection")
const productModel = require("../models/productModels")
const multer = require("multer")

module.exports = {
    addproduct: (ProDetails, images) => {
        return new Promise((resolve, reject) => {
            var Products = new productModel({
                productname: ProDetails.productname,
                ProDesc: ProDetails.ProdDesc,
                brand: ProDetails.brand,
                price: ProDetails.price,
                mycategory: ProDetails.mycategory,
                images: images

            })


            Products.save()
            resolve()
        })


    },
    productView: () => {
        return new Promise(async (resolve, reject) => {
            let products = await productModel.find()
            resolve(products)
        })
    },
    deleteProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await productModel.deleteOne({ _id: id })
            resolve()
        })
    },
    editProductpage: (proId) => {

        return new Promise(async(resolve, reject) => {
           let product= await productModel.findOne({ _id: proId })
                resolve(product)
           
        })
    }
}