const jwt = require("jsonwebtoken");

module.exports = {
    onlyUsers: (req, res, next) => {
        //console.log('onlyUsers: authHeader = ', req.headers["token"]);
        jwt.verify(req.headers["token"], process.env.TOKEN_SECRET, (error, payload) => {
            if (error) {
                res.status(401).json({ err: true, msg: error.message })
            } else {
                req.user = payload._doc
                next()
            }
        })
    },

    onlyAdmin: (req, res, next) => {
        //console.log('onlyAdmin: authHeader = ', req.headers["token"]);
        jwt.verify(req.headers["token"], process.env.TOKEN_SECRET, (error, payload) => {
            if (error) {
                res.status(401).json({ err: true, msg: error.message })
            } else {
                req.user = payload._doc;
                console.log('req.user = ', req.user);
                if (req.user.role != "admin") {
                    res.status(401).json({ err: true, msg: "you don't have permissions for this operation" });
                } else {
                    next();
                }
            }
        })
    }
}