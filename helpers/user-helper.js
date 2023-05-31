
const bcrypt = require("bcrypt")
const userModel = require("../models/usermodels")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const cartModel = require("../models/cartModels")
const productModels = require("../models/productModels")
const wishlistModels = require("../models/wishlistModels")
const addressModel = require("../models/addressModel")
const couponModels = require("../models/couponModels")
const orderModels = require("../models/orderSchema")
const cartModels = require("../models/cartModels");
const orderSchema = require("../models/orderSchema");
const Razorpay = require('razorpay');
const crypto = require("crypto");
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEYID,
    key_secret: process.env.RAZORPAY_KEYSECRET
})
module.exports = {

    signUp: (userData) => {
        let response = {
            status: false
        }

        return new Promise(async (resolve, reject) => {
            await userModel.findOne({ email: userData.email }).then(async (status) => {
                if (status) {

                    response.status = true
                    resolve(response)
                }
                else {

                    const username = userData.username;
                    const email = userData.email;
                    const password = userData.password;
                    const mobile = userData.mobile;

                    const user = { id: Math.floor(Math.random() * 9000 + Date.now()) };
                    const secret = "mysecreatkey";
                    const token = jwt.sign(user, secret, { expiresIn: "1h" });
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        host: "smtp.gmail.com",
                        port: 465,

                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'flexcartshopping@gmail.com',
                            pass: 'cmxnofvpdlvqlqzs'
                        },
                    });
                    let mailData = {
                        from: 'flexcartshopping@gmail.com>', // sender address
                        to: userData.email,
                        subject: "Email verification for the Flexkart account", // Subject line
                        text: `Please click on the following link to verify your email address:http://localhost:3000/verify?token=${token}&username=${username}&email=${email}&mobile=${mobile}&password=${password}`,
                    };
                    transporter.sendMail(mailData, function (error, info) {
                        if (error) {

                        } else {
                            response.status = false
                            resolve(response);
                        }
                    });
                }
            })
        })
    },
    userlogIn: (userData) => {

        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ email: userData.email })
            if (user) {
                await bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.status = true
                        response.user = user
                        resolve(response);
                    }
                    else {
                        resolve({ status: false })
                    }
                })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    productView: () => {
        return new Promise(async (resolve, reject) => {
            let data = await productModels.find()
            resolve(data)
        })
    },
    cartItems: (proId, userId) => {
        let products = {
            productId: proId,
            quantity: 1,

        }
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId: userId })
            if (!cart) {
                const cartProduct = new cartModel({
                    cartProduct: products,
                    userId: userId
                })
                cartProduct.save()
                resolve();


            } else {

                let index = cart.cartProduct
                let product = index.findIndex(pro => pro.productId == proId)

                if (product != -1) {
                    await cartModel.updateOne(
                        { "cartProduct.productId": proId, userId: userId },
                        { $inc: { "cartProduct.$.quantity": 1 } }

                    )
                    resolve()
                }
                else {
                    await cartModel.updateOne({ userId: userId },
                        {
                            $push: { cartProduct: products }
                        })
                    resolve()

                }

            }




        })

    },
    wishListItem: (proId, userId) => {

        let product = {
            productId: proId,
        }
        return new Promise(async (resolve, reject) => {
            let list = await wishlistModels.findOne({ userId: userId })
            if (!list) {
                var wished = new wishlistModels({
                    userId: userId,
                    Items: product
                })
                wished.save().then(() => {
                    resolve()
                })
            }

            else {
                let exist = await wishlistModels.findOne({ "Items.productId": proId })
                if (!exist)
                    await wishlistModels.updateOne({ userId: userId },
                        {
                            $push: { Items: product }
                        })

                resolve()
            }
        })
    },
    getCartpro: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartModel.findOne({ userId: userId })
                .populate("cartProduct.productId").then((data) => {
                    if (data) {
                        resolve(data.cartProduct)
                    }
                    else {
                        reject()
                    }
                })
        })

    },


    wishlistPage: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await wishlistModels.findOne({ userId: userId })
            if (user) {
                await wishlistModels.findOne({ userId: userId })
                    .populate("Items.productId").then((data) => {
                        resolve(data.Items)
                    })
            }
            else {
                resolve();
            }
        })

    },
    deleteWished: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            await wishlistModels.findOne({ productId: proId })
            await wishlistModels.updateOne({ "Items.productId": proId },
                { $pull: { Items: { productId: proId } } })
            resolve()
        })
    },
    cartDel: (proId, userId) => {
        return new Promise(async (resolve, reject) => {

            let cha = await cartModel.findOne({ userId: userId })


            await cartModel.updateOne({ userId: userId },
                { $pull: { cartProduct: { productId: proId } } })
            resolve()
        })
    },
    changeQuantity: (data, userId) => {
        let proId = data.proId
        let price = data.price
        let quantity = data.quantity
        let count = data.count
        return new Promise(async (resolve, reject) => {
            await cartModel.findOne({ userId: userId })
            if (count == -1 && quantity == 1) {
                await cartModel.updateOne({ userId: userId },
                    { $pull: { cartProduct: { "productId": proId } } })
                resolve()
            }
            else {
                await cartModel.updateOne({ "cartProduct.productId": proId },
                    { $inc: { "cartProduct.$.quantity": count } })
                resolve()

            }
        })
    },
    setdefaultAddress: (userId, address) => {
        return new Promise(async (resolve, reject) => {
            let exist = await addressModel.findOne({ userId: userId })
            if (!exist) {
                const DefAddress = new addressModel({
                    userId: userId,
                    userAddress: [{
                        fname: address.fname,
                        lname: address.lname,
                        country: address.country,
                        house: address.homeaddress,
                        pincode: address.pincode,
                        email: address.email,
                        phone: address.phone,
                        status: true
                    }]
                })
                DefAddress.save().then(() => {
                    resolve()
                })
            } else {
                await addressModel.updateOne({ userId: userId },
                    {
                        $push: {
                            userAddress: [{
                                fname: address.fname,
                                lname: address.lname,
                                country: address.country,
                                house: address.homeaddress,
                                pincode: address.pincode,
                                email: address.email,
                                phone: address.phone,
                            }]
                        }
                    })
                resolve()
            }
        })


    },
    selectAdd: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await addressModel.findOne({ userId: userId })
            resolve(data)

        })
    },
    setDefaultButton: (userId, addId, status) => {
        return new Promise(async (resolve, reject) => {
            let adress = await addressModel.findOne({ userId: userId })
            if (adress) {
                await addressModel.updateOne({ "userAddress.status": true },
                    { $set: { "userAddress.$.status": false } })

                await addressModel.updateOne({ "userAddress._id": addId },
                    { $set: { "userAddress.$.status": true } }).then(() => {

                        resolve()
                    })
            }
            else {
                resolve()
            }
        })


    },
    checkOutAddress: (userId) => {
        return new Promise(async (resolve, reject) => {
            let exist = await addressModel.findOne({ userId: userId })
            if (exist) {
                await addressModel.findOne({
                    userAddress:
                        { $elemMatch: { status: true } }
                })
                    .then(async (datas) => {
                        const data = await datas.userAddress.find(obj => obj.status == true);


                        await cartModel.findOne({ userId: userId })
                            .populate("cartProduct.productId").then((carts) => {
                                let cart = carts.cartProduct
                                let total = cart.reduce((total, cart) => {
                                    return total + cart.productId.price * cart.quantity
                                }, 0)
                                cart.total = total
                                let obj = { coupon: data, carts: cart }
                                resolve(obj)
                            })

                    })
            } else {
                resolve()
            }
        })


    },
    CouponButton: (couponId, user) => {
        return new Promise(async (resolve, reject) => {
            let exist = await couponModels.findOne({ couponId: couponId })
            if (exist && Date.now() < exist.expiryDate) {

                await cartModel.findOne({ userId: user })
                    .populate("cartProduct.productId").then((carts) => {
                        let cart = carts.cartProduct
                        let total = cart.reduce((total, cart) => {
                            return total + cart.productId.price * cart.quantity
                        }, 0)

                        let perAmount = (total * exist.percentage) / 100

                        if (perAmount > exist.maxAmount) {
                            cart.total = total - exist.maxAmount
                            let offerTotal = cart.total
                            resolve({ offerTotal, couponId })
                        }
                        else {
                            cart.total = total - perAmount
                            let offerTotal = cart.total
                            resolve({ offerTotal, couponId })
                        }

                    }).catch((error) => {

                    })
            } else {
                await cartModel.findOne({ userId: user })
                    .populate("cartProduct.productId").then((carts) => {
                        let cart = carts.cartProduct
                        let total = cart.reduce((total, cart) => {
                            return total + cart.productId.price * cart.quantity
                        }, 0)
                        cart.total = total
                        resolve(cart.total)
                    })
            }
        })
    },
    placeOrd: (user, order) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModels.findOne({ userId: user })
            let prodId = cart.cartProduct
            const orderModel = new orderModels({
                userId: user,
                OrderAddress: {
                    fname: order.fname,
                    lname: order.lname,
                    country: order.country,
                    street: order.street,
                    town: order.town,
                    state: order.state,
                    pincode: order.pincode,
                    mobile: order.mobile,
                    email: order.email,
                    message: order.message,
                    total: parseInt(order.total),
                    method: order.paymentMethod,
                    date: Date.now(),
                    status: "Order Placed"
                },
                cart: prodId
            })
            orderModel.save().then(async (data) => {
                resolve(data)

            })


        })
    },
    placedOrder: (userId) => {
        return new Promise(async (resolve, reject) => {
            await orderModels.find({ userId: userId }).then((data) => {
                resolve(data)
            })
        })

    },
    buttonForReturn: (orderId, status) => {
        return new Promise(async (resolve, reject) => {
            await orderModels.updateOne({ _id: orderId },
                { $set: { "OrderAddress.status": status } })
            let order = await orderModels.findOne({ _id: orderId })

            let state = order.OrderAddress.status
            resolve(state)
        })
    },
    cancelOrderButton: (orderId, status) => {
        return new Promise(async (resolve, reject) => {
            await orderModels.updateOne({ _id: orderId },
                { $set: { "OrderAddress.status": status } })
            let order = await orderModels.findOne({ _id: orderId })
            let state = order.OrderAddress.status
            resolve(state)
        })
    },
    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            var option = {
                amount: parseInt(total) * 100,
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(option, function (err, order) {
                resolve(order)
            });
        })
    },





    verifyPayment: (detail) => {
        let details = detail.response;

        return new Promise((resolve, reject) => {
            let hmac = crypto.createHmac('sha256', '8RVnZ4X5kj2Y5pwTYJOHkrtm');

            hmac.update(
                details.razorpay_order_id +
                "|" +
                details.razorpay_payment_id
            );

            let calculatedSignature = hmac.digest("hex");

            if (calculatedSignature === details.razorpay_signature) {
                resolve(); // Payment is verified, resolve the promise
            } else {
                reject(); // Payment is not verified, reject the promise
            }
        });



    },

    changeStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModels.updateOne({ _id: orderId },
                { $set: { 'OrderAddress.status': "Placed UPI" } });
            resolve();
        });

    }






}
    // viewOrders: () => {
    //     return new Promise(async (resolve, reject) => {
    //         await orderModels.updateOne({ _id: orderId })
    //     })
    // }













