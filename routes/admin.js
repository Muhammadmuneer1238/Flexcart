var express = require('express');
var router = express.Router();
const { AddPage, adminpage, adminReg, adminLoginPage, userList,
    adminLogin, couponValidation, couponInsertion, coupons,
    userOrders, StatusChange, orderDetailView ,indexPage} = require("../controller/adminController");
const { addProduct, viewProduct, deletePro,editPro,productEditpage } = require("../controller/productController");
const multer = require("multer");
const {  } = require('../controller/userController');
const adminLogged = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect("/loginPage")
    }
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname);
        console.log("fileeeeeeeee", file);
    }
})
const upload = multer({ storage: storage });
const cpUpload = upload.array("images", 4);
router.get("/add-product", adminLogged, AddPage);
router.post("/add-product", cpUpload, addProduct)
router.post("/admin-reg", adminReg);
router.get("/admin-reg", adminpage);
router.get("/admin-login", adminLoginPage);
router.post("/admin-login", adminLogin);
router.get("/product-view",  viewProduct);
router.get("/userlist", adminLogged, userList);
router.get("/delete/:id", deletePro);
router.get("/couponValid", adminLogged, couponValidation);
router.post("/couponValidation", couponInsertion);
router.get("/coupons", adminLogged, coupons);
router.get("/orders", adminLogged, userOrders);
router.post("/orderStatusChange", StatusChange);
router.post("/orderDetail", orderDetailView);
router.get("/",indexPage)
router.get("/productEdit/:id",editPro)
router.post("/editpro",)
module.exports = router;
