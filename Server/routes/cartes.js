const router = require("express").Router();
var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const path = require('path');
const { onlyUsers } = require("../vf/verifytoken");
const { CartModel } = require("../models/cart.model");
const { CartItemModel } = require("../models/cartItem.model");
const { ProductModel } = require("../models/product.model");

// GET: /cartes/new
router.get("/new", onlyUsers, async (req, res) => {
    //console.log("/new: user = ", req.user);
    let _userID = req.user.id
    try {
        const _newCart = new CartModel({ id_user: _userID });
        _newCart.save();
        res.json({ err: false, result: _newCart });
        // console.log("new: _newCart = ", _newCart);
        // return _newCart
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}) // Get new Cart

// GET: /cartes/current
router.get("/current", onlyUsers, async (req, res) => {
    console.log("/current: user = ", req.user);
    let _userID = req.user.id;
    try {
        const carts = await CartModel.find({
            id_user: _userID,
            isClosed: false
        });
        //console.log("current: carts = ", carts);

        if (carts.length == 0) {
            res.json({ err: false, result: null, msg:"current cart not found"});
        } else {
            //console.log("cartes.current: carts[0]._id = ", carts[0]._id);
            let cart = {
                _id: carts[0]._id.toString(),
                //id_user: _userID,
                date_create: carts[0].date_create,
                isClosed: false
            };
            // console.log("cartes.current: cart = ", cart);
            var _hostUrl = req.protocol + '://' + req.get('host');
            let _imgMetod = _hostUrl + '/pictures/';
            cart.items = await getCartItems(cart._id, _imgMetod);

            //console.log("cartes.current: cartItems = ", cartItems);
            console.log("cartes.current: cart = ", cart);
            res.json({ err: false, result: cart });
        }
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}) // Get current Cart

// GET: /cartes/userDetails
router.get("/userDetails", onlyUsers, async (req, res) => {
    //console.log("/userDetails: user = ", req.user);
    let _user = req.user
    try {
        if (_user) {
            let _details = {
                firstName: _user.firstName,
                lastName: _user.lastName,
                city: _user.city,
                street: _user.street
            };
            console.log("cartes.userDetails: _details = ", _details);
            res.json({ err: false, result: _details });
        } else {
            res.json({ err: true, msg: "user not found" });
        }
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // get user details

let getCartItems = async (id_cart, imgMetod) => {
    // get cartItems by cart
    const cartItems = await CartItemModel.find({
        id_cart: id_cart
    });
    //console.log("getCartItems: cartItems = ", cartItems);
    // convert cartItems to cItems array, and get ID's of products
    let _citems = [], _prodIds = [];
    cartItems.forEach(item => {
        let _citem = {
            _id: item._id,
            id_product: item.id_product,
            amount: item.amount,
            origin_price: item.origin_price,
            id_cart: item.id_cart
        };
        _citems.push(_citem);
        var _id = mongoose.Types.ObjectId(item.id_product);
        _prodIds.push(_id);
    });
    //console.log("getCartItems: _prodIds = ", _prodIds);

    // get products by ID's
    const _products = await ProductModel.find({
        "_id": {
            "$in": _prodIds
        }
    });
    // create dictionary {prodID,{imgName,name}}
    let productsDictionary = {};
    _products.forEach(prod => {
        //productsDictionary[prod._id] = prod.img;
        productsDictionary[prod._id] = {
            imgName: prod.img,
            name: prod.name
        };
    });
    //console.log("getCartItems: _products = ", _products);
    //console.log("getCartItems: productsDictionary = ", productsDictionary);

    _citems.map(item => {
        if (productsDictionary[item.id_product]) {
            let _imgName = productsDictionary[item.id_product].imgName;
            let _imgUrl = (imgMetod + _imgName);
            //console.log("getCartItems: ", item.id_product, "\n_imgUrl = ", _imgUrl);
            item["img"] = _imgUrl;
            item["name"] = productsDictionary[item.id_product].name;
        }
    });
    return _citems;
};

// POST: /cartes/product
router.post("/product", onlyUsers, async (req, res) => {
    //console.log("product: req.body = ", req.body);
    const { amount, origin_price, id_cart, id_product } = req.body;

    try {
        let _citem = {
            id_product: id_product,
            amount,
            origin_price,
            id_cart
        };
        console.log("product: _citem = ", _citem);
        const _cartItem = new CartItemModel(_citem);
        let result = await _cartItem.save();

        res.json({
            err: false,
            msg: "product add to the cart",
            result
        });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // post product

// DELETE: /cartes/cart: cartID
router.delete("/:cartID", onlyUsers, async (req, res) => {
    let _cartID = req.params.cartID;
    console.log("cartes.delete: _cartID = ", _cartID);

    try {
        CartItemModel.deleteMany({ id_cart: _cartID }, null, (err) => {
            if (err) {
                console.log("cartes.deleteCart: err = ", err);
                return res.json({ err: true, msg: err.message });
            } else {
                CartModel.deleteOne({ _id: _cartID }, null, (err) => {
                    if (err) {
                        console.log("cartes.delete: err = ", err);
                        return res.json({ err: true, msg: err.message });
                    }
                    res.json({ err: false, msg: "cart delete from db" });
                });
            }
        });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }

}) // delete cart by cartID

// DELETE: /cartes/product: cartItemID
router.delete("/product/:cartItemID", onlyUsers, async (req, res) => {
    let _cartItemID = req.params.cartItemID;
    console.log("cartes.delete: _cartItemID = ", _cartItemID);

    try {
        CartItemModel.deleteOne({ _id: _cartItemID }, null, (err) => {
            if (err) {
                console.log("cartes.delete: err = ", err);
                return res.json({ err: true, msg: err.message });
            }
            res.json({ err: false, msg: "product delete from cart" });
        });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}) // delete product from cart

//module.exports = router;
module.exports = {
    cartesRoutes: router,
    getCartItems
};