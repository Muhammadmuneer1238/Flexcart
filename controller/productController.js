const { addproduct, productView, deleteProduct, editProductpage } = require("../helpers/product-helper")
const layout = "admin/adminLayout"
const productModel = require("../models/productModels")
const multer = require("multer")

module.exports = {


    addProduct: (req, res) => {
        try {
            var file = req.files
            const files = file.map((image) => {
                return image.filename
            })
            addproduct(req.body, files).then(() => {
                res.redirect("/admin/add-product")
            })
        }
        catch {
            res.redirect('/error')
        }
    },
    viewProduct: (req, res) => {
        try {
            productView().then((product) => {
                if (req.session.admin) {
                    let admin = req.session.admin
                    res.render("admin/product-view", { admin, product, layout })
                }
                else {
                    res.redirect('/admin/admin-login')
                }
            })
        }
        catch {
            res.render("error")
        }
    },
    deletePro: (req, res) => {
        try {
            let id = req.params.id
            deleteProduct(id)
            res.redirect("/admin/product-view");
        }
        catch
        {
            res.render("error")
        }
    },
    editPro: (req, res) => {
        let proId = req.params.id
        let admin = req.session.admin
        editProductpage(proId).then((product) => {
            res.render("admin/productEdit", { product, layout })

        })
    },
    productEditpage: (req, res) => {


    }

}
