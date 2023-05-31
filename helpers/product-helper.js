const db = require("../config/connection")
const productModel = require("../models/productModels")
const multer = require("multer")

module.exports = {
    addproduct: (ProDetails, images) => {
        console.log(ProDetails);
        return new Promise((resolve, reject) => {
            var Products = new productModel({
                productname: ProDetails.productname,
                ProdDesc: ProDetails.ProdDesc,
                brand: ProDetails.brand,
                price: ProDetails.price,
                mycategory: ProDetails.mycategory,
                images: images

            })


            Products.save()
            console.log(Products);
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
    }
}