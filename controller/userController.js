const userHelper = require('../helpers/user-helper')
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const userModel = require("../models/usermodels")
const swal = require("sweetalert");
const cartModels = require('../models/cartModels');
const addressModel = require("../models/addressModel");
const orderSchema = require('../models/orderSchema');
const Razorpay = require('razorpay');
const { response } = require('express');



module.exports = {
    index: (req, res) => {
        userHelper.productView().then((product) => {
            if (req.session.user) {
                let user = req.session.user
                res.render("index", { product, user });
            } else {
                res.render('index', { product })
            }
        })
    },
    loginPage: (req, res) => {
        try {

            res.render("login")
        }
        catch (error) {
            res.render('error')
        }
    },
    logout: (req, res) => {
        try {
            req.session.destroy()
            res.redirect("/loginPage")
        }
        catch {
            res.redirect("/")
        }

    },
    userLogin: (req, res) => {
        try {
            userHelper.userlogIn(req.body).then((response) => {
                if (response.status) {
                    req.session.loggedIn = true
                    req.session.user = response.user
                    res.redirect("/")
                }
                else {
                    req.session.loginErr = true
                    res.redirect("/loginPage")
                }
            })
        }
        catch {
            res.redirect("/error")
        }
    },

    userSignup: (req, res) => {

        userHelper.signUp(req.body).then((response) => {
            if (response.status) {
                req.session.loginErr = true
                res.render('login', { "loginErr": req.session.loginErr })

            }
            else {
                alert('Login with your Email Link');
                res.redirect("/")
            }
        })
    },
    verifyemail: (req, res) => {
        try {
            const token = req.query.token;
            const username = req.query.username;
            const email = req.query.email;
            var password = req.query.password;
            var mobile = req.query.mobile;
            const secret = "mysecreatkey";
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                } else {
                    return new Promise(async (resolve, reject) => {
                        password = await bcrypt.hash(password, 10);
                        var userDetails = new userModel({
                            username: username,
                            email: email,
                            mobile: mobile,
                            password: password,
                        });
                        userDetails.save().then((response) => {
                            req.session.loggedIn = true
                            req.session.user = response.user
                            res.redirect("/");
                        });
                    })
                }
            })
        }
        catch {
            res.redirect('/error');
        }
    },
    Cart: (req, res) => {
        try {
            let user = req.session.user
            let userId = req.session.user._id
            userHelper.getCartpro(userId).then((data) => {
                let total = data.reduce((total, data) => {
                    return total + data.productId.price * data.quantity
                }, 0)
                data.total = total
                res.render("cart", { data, user });



            }).catch(() => {

                res.render("emptycart", { user })
            })


        }
        catch (error) {
            res.redirect('/error')
        }
    },
    addTocart: (req, res) => {
        let proId = req.body.productId;
        let user = req.session.user
        if (user) {
            let userId = req.session.user._id
            userHelper.cartItems(proId, userId).then(() => {
                res.json({ added: true })
            })
        } else {

            res.json({ added: false })
        }


    },

    wishList: (req, res) => {       //add to  wishlist
        let proId = req.body.productId
        let user = req.session.user
        if (user) {
            let userId = req.session.user._id
            userHelper.wishListItem(proId, userId).then(() => {
                res.json({ status: true })
            })
        } else {
            res.json({ status: false })
        }


    },
    wishPage: (req, res) => {//wishlist page route
        let user = req.session.user
        let userId = req.session.user._id
        userHelper.wishlistPage(userId).then((data) => {
            if (data) {
                res.render("wishlist", { data, user })
            }
            else {
                res.render("emptycart", { user })
            }
        }).catch(() => {
            res.render("emptycart", { user })
        })
    },
    delCartPro: (req, res) => {//delete the cart product
        let proId = req.body.id
        let userId = req.session.user._id
        userHelper.cartDel(proId, userId).then(() => {
            res.json({ status: true })
        })
    },
    changeQuantity: (req, res) => {//change quatity of product in cart
        let userId = req.session.user._id
        userHelper.changeQuantity(req.body, userId).then(() => {
            res.json({ status: true })
        })




    },
    deleteWishitem: (req, res) => {//delete the  wishlist products
        let userId = req.session.user._id
        let proId = req.body.id
        userHelper.deleteWished(proId, userId).then(() => {
            res.json({ status: true })

        })



    },
    contact: (req, res) => {
        try {
            let user = req.session.user
            res.render("contact", { user })
        }
        catch (error) {
            res.render('error')
        }
    },

    soon: (req, res) => {
        try {
            res.render("coming-soon")
        }
        catch (error) {
            res.render('error')
        }
    },
    faq: (req, res) => {
        try {
            res.render("faq")
        }
        catch (error) {
            res.render('error')
        }
    },

    mailVerify: (req, res) => {
        try {
            res.render('mailVerify')
        }
        catch
        {
            res.render('error')

        }
    },
    checkoutPage: (req, res) => {
        try {
            let userId = req.session.user._id
            userHelper.checkOutAddress(userId).then((datas) => {
                let coupon = datas.coupon
                let total = datas.carts
                res.render("checkout", { coupon, total })
            })
        }
        catch {

        }
    },
    defaultAddress: (req, res) => {
        try {
            res.render("defaultAddress")
        }
        catch {

        }
    },
    setDefaultAdd: (req, res) => {
        try {
            let userId = req.session.user._id
            userHelper.setdefaultAddress(userId, req.body).then(() => {
                res.redirect("/")
            })
        }
        catch {

        }
    },
    prodetail: (req, res) => {
        try {
            let user = req.session.user
            res.render("prodetail", { user })
        }
        catch {

        }
    },
    selectAddress: (req, res) => {
        try {
            let userId = req.session.user._id
            let user = req.session.user
            userHelper.selectAdd(userId).then((datas) => {
                if (datas) {

                    let data = datas.userAddress

                    res.render("selectAddress", { data, user })
                }
                else {
                    res.redirect("/defaultAddress")
                }
            })


        }
        catch {

        }
    },
    setButtonDefault: (req, res) => {
        try {
            let userId = req.session.user._id
            let addId = req.body.addId
            let status = req.body.status
            userHelper.setDefaultButton(userId, addId, status).then(() => {
                res.json({ status: true })
            })
                .catch(() => {
                    res.redirect("/defaultAddress")
                })
        }
        catch {

        }
    },
    applyCouponButton: (req, res) => {
        let user = req.session.user._id
        let couponcode = req.body.couponcode
        userHelper.CouponButton(couponcode, user).then((total) => {
            ;
            res.json(total)
        })
    },
    placeOrder: (req, res) => {
        let user = req.session.user._id
        let data = req.body


        userHelper.placeOrd(user, data).then((order) => {

            let orders = order.OrderAddress
            let total = order.OrderAddress.total
            let orderId = order._id


            if (orders.method != 'cod') {

                userHelper.generateRazorpay(orderId, total).then((order) => {
                    ;
                    res.json(order)

                })
            } else {
                res.json({ codStatus: true })
            }
        })

    },
    orderDetail: (req, res) => {
        let user = req.session.user
        let userId = req.session.user._id
        userHelper.placedOrder(userId).then((datas) => {
            let data = datas.sort((a, b) => b.OrderAddress.date - a.OrderAddress.date);
            res.render("orderDetails", { user, data })
        })
    },
    buttonReturn: (req, res) => {
        let orderId = req.body.id
        let status = req.body.status

        userHelper.buttonForReturn(orderId, status).then((data) => {

            res.json(data)
        })

    },
    cancelOrder: (req, res) => {
        try {
            let orderId = req.body.OrderId
            let status = req.body.status

            userHelper.cancelOrderButton(orderId, status).then((data) => {
                res.json(data)
            })
        }
        catch {

        }
    },
    razorpayPayment: (req, res) => {
        let orderId = req.body.order.receipt
                userHelper.verifyPayment(req.body).then(() => {
            userHelper.changeStatus(orderId).then(() => {
                res.json({ status: true })
            })
        }).catch((err) => {
            res.json({ status: false })
        })
},
    placed: (req, res) => {
        res.render("placed")
    }
}