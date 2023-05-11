const router = require("express").Router();
const path = require('path');
const bcrypt = require("bcrypt");
const { onlyAdmin } = require("../vf/verifytoken");

// http://localhost:4000/pictures/cucumber.png
router.get("/:picName", async (req, res) => {
    const _picName = req.params.picName;
    console.log("pictures.get: _picName= ", _picName);
    //const _imagePath = __dirname + '/images/' + _picName;
    const _imagePath = path.join(__dirname,'../images/', _picName);
    console.log("pictures.get: _imagePath = ", _imagePath);
    try {
        return res.sendFile(_imagePath);
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
}); //get path picture picName

module.exports = router;