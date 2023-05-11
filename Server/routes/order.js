const router = require("express").Router();
var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const path = require('path');
const { onlyUsers } = require("../vf/verifytoken");
const { OrderModel } = require("../models/order.model");
const { CartModel } = require("../models/cart.model");
const { CartItemModel } = require("../models/cartItem.model");

// POST: /order
router.post("/", onlyUsers, async (req, res) => {
    let _userID = req.user.id

    console.log("order: _userID = ", _userID
        , "req.body = ", req.body);
    const {
        city,
        street,
        date_send,
        credit_card } = req.body;

    //console.log("order: _userID = ",_userID);

    try {
        let _currentCart = await getCurrentCart(_userID);
        if (!_currentCart) {
            return res.status(400)
                .json({ err: true, msg: "cart that open, not found" });
        }

        console.log("order: cartID = ", _currentCart._id);
        let _total = await getTotalByCart(_currentCart._id.toString());

        let _order = {
            id_user: _userID,
            sum: _total,
            city,
            street,
            date_send,
            date_order: _currentCart.date_create,
            id_cart: _currentCart._id,
            credit_card
        };
        //console.log("order: _order = ", _order);
        const order = new OrderModel(_order);
        let result = await order.save();

        console.log("order: result = ", result
            , ', result._id = ', result._id);
        if (result && result._id) {
            // close a cart, 
            //update cart for isClosed: true
            _currentCart.isClosed = true;
            let _cartSaved = await _currentCart.save();
            console.log("order: _cartSaved = ", _cartSaved);
        }

        res.json({
            err: false,
            msg: "order added to the db successfully",
            result
        });

    } catch (error) {
        console.warn('order: error ', error.message);
        res.status(400).json({ err: true, msg: error.message });
    }
}); // Post Order


let getCurrentCart = async (userID) => {
    const _carts = await CartModel.find({
        id_user: userID,
        isClosed: false
    });
    console.log("order.getCurrentCart: _carts = ", _carts);
    return _carts[0];
}; //getCurrentCart

let getTotalByCart = async (cartID) => {
    const _items = await CartItemModel.find({
        id_cart: cartID
    });

    let _total = 0;

    _items.forEach(item => {
        let _totalAmount = (item.amount * item.origin_price);
        _total += _totalAmount;
    });

    //console.log("order.getTotalByCart: _total = ", _total);
    return _total;
}


router.get("/", onlyUsers, async (req, res) => {
    try {
        const order = await OrderModel.find();
        res.json({ err: false, result: order });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // Get Orders

// GET: /order/closedDates
router.get("/closedDates", onlyUsers, async (req, res) => {
    try {
        let _orderDates = await OrderModel.aggregate([
            {
                $sort: { date_send: 1 }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_send" } },
                    orders: { $sum: 1 }
                }
            }
        ]);

        if (_orderDates.length > 0) {
            let _closedDates = [];
            _orderDates.forEach(item => {
                if (item.orders > 2) {
                    _closedDates.push(item._id);
                }
            });

            res.json({ err: false, result: _closedDates });
        } else {
            res.json({ err: false, msg: "orders not found" });
        }

    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }

});

module.exports = router;