var express = require('express');

const
    {
        index, loginPage,logout, userLogin, userSignup, verifyemail, Cart,
        addTocart, wishList, wishPage, delCartPro, changeQuantity,
        deleteWishitem, contact, soon, faq, checkoutPage,
        defaultAddress, setDefaultAdd,prodetail,selectAddress,
        setButtonDefault,applyCouponButton,placeOrder,
        orderDetail,buttonReturn,cancelOrder,razorpayPayment,placed
    } = require('../controller/userController');
var router = express.Router();
const verifylogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next()
    } else {
        res.redirect("/loginPage")
    }
}
router.get('/', index);
router.get("/loginPage", loginPage);
router.post("/loginPage", userLogin);
router.get("/logout",logout)
router.post('/signup', userSignup);
router.get("/cart", verifylogin, Cart);
router.get("/contact", contact);
router.get("/coming-soon",verifylogin, soon);
router.get("/faq",verifylogin, faq);
router.get("/verify", verifyemail);
router.post("/cartPro", addTocart)
router.post('/deleteCartpro', delCartPro)
router.post("/changeQuantity", changeQuantity)
router.get("/wishlistPage", verifylogin, wishPage)
router.post("/deleteWish", deleteWishitem)
router.post('/wishlist', wishList)
router.get("/defaultAddress", verifylogin,defaultAddress)
router.post("/setDefaultadd", setDefaultAdd)
router.get("/checkout", verifylogin,checkoutPage)
router.get("/prodetail",verifylogin,prodetail)
router.get("/selectAddress",verifylogin,selectAddress)
router.post("/setAddressDefault",setButtonDefault)
router.post("/applyCoupon",applyCouponButton)
router.post("/placeOrder",placeOrder)
router.get("/orderDetails",verifylogin,orderDetail)
router.post("/returnButton",buttonReturn)
router.post("/orderCancel",cancelOrder)
router.post("/verify-payment",razorpayPayment)
router.get("/placed",verifylogin,placed)
module.exports = router;

