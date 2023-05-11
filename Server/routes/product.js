const router = require("express").Router();
//const form = require('connect-form');
//const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const path = require('path');
const multer = require('multer');
const upload = multer({
    storage:
        multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '../images/'));
            },
            filename: (req, file, cb) => {
                //console.log('diskStorage.filename: file = ', file);
                let fileName = file.originalname.replace(/\s|%/g, "_");
                cb(null, fileName);
            }
        })
});
const { onlyAdmin, onlyUsers } = require("../vf/verifytoken");
const { CategoryModel } = require("../models/category.model");
const { ProductModel, productCounter } = require("../models/product.model");


// for only test upload.single('img'),
router.post('/upload', onlyAdmin, upload.single('img'), (req, res) => {
    //console.log("product/upload: req.file = ", req.file);
    if (req.file) {
        //res.json(req.file);
        //let fileName = req.file.originalname.replace(/\s/g, "_")
        res.json({ err: false, result: req.file.filename })
    }
    //else throw 'error';
    else {
        res.json({ err: true, msg: "file was not uploaded" });
    }
}); // Post upload

//  upload.single('req.body.img'),
router.post("/addProduct", onlyAdmin, async (req, res) => {
    console.log("addProduct: req.body = ", req.body);
    const { name, price, img, id_category } = req.body;
    //console.log("addProduct: fileName = ", req.file);
    try {
        let _product = { name, price, img, id_category };
        const product = new ProductModel(_product);
        let db_response = await product.save();
        console.log('addProduct: db_response = ', db_response);
        res.json({ err: false, msg: "product saved in the data base" });
    } catch (error) {
        console.log('addProduct: Error:', error.message);
        res.status(400).json({ err: true, msg: error.message });
    }
}); // post Add Product

router.get("/categories", onlyUsers, async (req, res) => {
    //console.log("/categories: user = ", req.user.firstName
     //   , ' ', req.user.lastName);
    try {
        const category = await CategoryModel.find();
        res.json({ err: false, result: category });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // Get Categories

// GET: /product/catID
router.get("/:categoryID", onlyUsers, async (req, res) => {
    const _categoryIDStr = req.params.categoryID;
    //console.log("get product: _categoryIDStr = ", _categoryIDStr);

    // _hostUrl =  http://localhost:4000
    var _hostUrl = req.protocol + '://' + req.get('host');
    //console.log("get product: _hostUrl = ", _hostUrl);

    const _categoryID = parseInt(_categoryIDStr);
    //console.log("get product: typeof(categoryID) = ", typeof(_categoryID));

    if (isNaN(_categoryID)) {
       // console.warn("get product: _categoryID = ", _categoryID);
        return res.json({ err: true, msg: "param is not valid" });
    }
    try {

        ProductModel.find(
            { "id_category": _categoryID },
            function (err, docs) {
                if (err) {
                    return res.json({ err: true, msg: err.message });
                }
               // console.log("get product: [" + _categoryID + "] returns ", docs.length, " items");
                // for each product update field 'img'
                let products = [];
                let _imgMetod = _hostUrl + '/pictures/';
                docs.forEach(item => {
                    let _item = item;
                    // http://localhost:4000/pictures/tonic.png
                    _item.img = (_imgMetod + _item.img);
                    // add to products
                    products.push(_item);
                })
                res.json({ err: false, result: products });
            }
        ); // find       
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // Get Product By CategoryID

router.put("/", onlyAdmin, async (req, res) => {
    const { _id, name, price, id_category } = req.body;
   // console.log("Product.putProductID: req.body = ", req.body);
    if (!_id || !name || !price || !id_category)
        return res.json({ err: true, msg: "missing some info" });
    try {
        ProductModel.findOneAndUpdate({ _id: _id }, {
            name: name,
            price: price,
            id_category: id_category
        }, function (err, doc) {
            if (err) return res.send(500, { error: err });
           // console.log("Product.putProductID: doc= ", doc);
            return res.json({ err: false, msg: "product update in the data base" });
        });
        // 
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // update product

// GET: /product/search/mi
router.get("/search/:term", onlyUsers, async (req, res) => {
    const _term = req.params.term;
   // console.log("get product By Term: _term = ", _term);
    var _hostUrl = req.protocol + '://' + req.get('host');
   // console.log("get product By Term: _hostUrl = ", _hostUrl);
    try {
        ProductModel.find(
            { "name": { "$regex": _term, "$options": "i" } },
            function (err, docs) {
                if (err) {
                    return res.json({ err: true, msg: err.message });
                }
                let products = [];
                let _imgMetod = _hostUrl + '/pictures/';
                docs.forEach(item => {
                    let _item = item;
                    _item.img = (_imgMetod + _item.img);
                    products.push(_item);
                })
                res.json({ err: false, result: products });
            }
        )
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // Get product by Term

router.get("/count/products", async (req, res) => {
    try {
        const countProducts = await ProductModel.count();
        res.json({ err: false, result: countProducts });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); // Get Count Products

module.exports = router;