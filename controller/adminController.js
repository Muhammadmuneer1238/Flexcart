const { adminsignup, Userlist, adminName, couponInsert, couponCard, orderByuser, StatusOrder } = require("../helpers/admin-helper")

const usermodels = require("../models/usermodels")
const productModels = require("../models/productModels")
const layout = "admin/adminLayout"
module.exports = {

    AddPage: (req, res) => {
        try {

            res.render("admin/add-product", { layout })
        }
        catch {
            re.render("error")
        }
    },
    adminpage: (req, res) => {
        try {
            res.render("admin/admin-reg", { layout })
        }
        catch {
            res.render("error")

        }

    },

    adminReg: (req, res) => {
        try {
            adminsignup(req.body)
            res.redirect("/")
        }
        catch {
            res.render("error")
        }
    },
    adminLoginPage: (req, res) => {
        try {

            res.render("admin/admin-login", { layout })
        }

        catch {
            res.render("error")
        }
    },
    adminLogin: (req, res) => {
        adminName(req.body).then((response) => {
            if (response.status) {
                req.session.loggedIn = true
                req.session.admin = response.admin
                res.redirect('/admin/')


            }

            else {
                req.session.loginErr = true
                res.redirect("/admin/admin-login")
            }
        })
    },
    // adminview: (req, res) => {
    //     try {

    //         res.redirect("/admin/product-view")
    //     }
    //     catch {
    //         res.render("error")
    //     }
    // },
    userList: (req, res) => {
        try {
            let admin = req.session.admin
            Userlist().then((data) => {

                res.render("admin/userlist", { layout, data, admin })
            })


        }


        catch {
            res.redirect("/error")
        }
    },
    couponValidation: (req, res) => {
        try {
            res.render("admin/couponValid", { layout })

        }
        catch {

        }

    },
    couponInsertion: (req, res) => {
        try {

            couponInsert(req.body)


            res.redirect("/admin/couponValid")
        }
        catch {
            res.redirect("/error")

        }

    },
    coupons: (req, res) => {
        couponCard().then((data) => {
            res.render("admin/coupons", { layout, data })
        })
    },
    userOrders: (req, res) => {
        orderByuser().then((order) => {
            res.render("admin/orders", { layout, order })
        })
    },
    StatusChange: (req, res) => {
        let status = req.body.status
        let orderId = req.body.id
        StatusOrder(status, orderId).then((state) => {

            res.json(state)
        })

    }, orderDetailView: (req, res) => {
        viewOrders().then(() => {

            res.render("admin/orderDetail", { layout })
        })

    },
    indexPage: (req, res) => {
        let admin = req.session.user
        res.render('admin/index', { layout,admin})
    },
    

}