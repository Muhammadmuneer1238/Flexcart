
const db = require("../config/connection")
const adminModel = require("../models/admin-models")
const usermodel = require("../models/usermodels")
const productModels = require("../models/productModels")
const bcrypt = require("bcrypt")
const { response } = require("../app")
const couponModels = require("../models/couponModels")
const orderModels = require("../models/orderSchema")

module.exports = {
    adminsignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let password = await bcrypt.hash(userData.password, 10);
            var adminDetails = new adminModel({
                username: userData.username,
                password: password,
            });
            adminDetails.save()
            resolve()
        })
    },
    Userlist: () => {
        return new Promise(async (resolve, reject) => {
            let userdetais = await usermodel.find()
            resolve(userdetais)
        })
    },
    adminName: (admins) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let admin = await adminModel.findOne({ username: admins.username })
            if (admin) {
                await bcrypt.compare(admins.password, admin.password).then((status) => {
                    if (status) {
                        response.status = true
                        response.admin=admin
                        resolve(response)                
                        }
                    else {
                        
                        resolve({status:false})
                    }

                })
            }
            else {
                resolve({status:false})
            }


        })

    },
    couponInsert: (couponId) => {
        return new Promise((resolve, reject) => {
            var coupon = new couponModels({
                couponId: couponId.couponId,
                expiryDate: couponId.expirydate,
                percentage: couponId.percentage,
                maxAmount: couponId.maxAmount,
                message: couponId.message
            })
            coupon.save()
            resolve()
        })
    },
    couponCard: () => {

        return new Promise(async (resolve, reject) => {
            await couponModels.find().then((data) => {
                resolve(data)
            })
        })
    },
    orderByuser: () => {
        return new Promise(async (resolve, reject) => {
            await orderModels.find().then((order) => {
                resolve(order)
            })
        })
    },
    StatusOrder: (orderStatus, orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModels.updateOne({ _id: orderId },
                { $set: { "OrderAddress.status": orderStatus } })
            let order = await orderModels.findOne({ _id: orderId })
            let status = order.OrderAddress.status
            resolve(status)
        })
    },  
    
}