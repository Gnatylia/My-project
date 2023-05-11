const { UserModel } = require("../models/user.model");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET /users/chkAdmin
router.get('/chkAdmin', async (req, res) => {
    try {
        const _users = await UserModel.find({ role: 'admin' });
        res.json({ err: false, msg: "admin is exist", result: (_users.length > 0) });
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
});

// POST /register
router.post("/register", async (req, res) => {
    console.log('/users/register: req.body = ', req.body);
    try {
        const { id, firstName, lastName, password, city, street, email, role } = req.body;
        // if
        if (!id || !firstName || !lastName || !password || !city || !street || !email) {
            res.status(400).json({ err: true, msg: "missing some info" });
        } else {
            let _recUser = { id, firstName, lastName, password, city, street, email };
            if (role) {
                _recUser.role = role;
            }

            const hash = await bcrypt.hash(password, 9);
            _recUser.password = hash;

            const user = new UserModel(_recUser);
            await user.save();
            console.log('register: user = ', user);
            res.json({ err: false, msg: "user saved in the data base" })
        };
    } catch (error) {
        res.status(400).json({ err: true, error });
    }
})

// POST /login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email });
        //console.log("login: user = ", user, "\nbody = ", req.body);
        if (!user) throw new Error("user not found");

        console.log('login: user = ', { username: user.email, role: user.role });
        const isMatch = await bcrypt.compare(password, user.password);
        //console.log("login: isMatch = ", isMatch);
        if (!isMatch) throw new Error('wrong password')
        //console.log("login: TOKEN_SECRET = ", process.env.TOKEN_SECRET);
        const token = jwt.sign(
            { ...user, password: "*********" },
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRE })
        res.json({
            err: false,
            token,
            result: (user.firstName + ' ' + user.lastName),
            role: user.role
        });

    } catch (error) {
        console.log("login: error = ", error)
        res.status(400).json({ err: true, msg: error.message });
    }
})

// GET /users
router.get("/:userID", async (req, res) => {
    //console.log("get.users: user = ", req.user);
    try {
        const _userID = req.params.userID;
        //console.log("Users.get: _userID = ", _userID)
        const _users = await UserModel.find({ id: _userID });
        //console.log("Users.get: _user = ", _users)
        if (_users[0]) {
            res.json({ err: false, msg: "such user already exists", result: _users[0] });
        } else {
            res.json({ err: false, msg: "user not found" });
        }
    } catch (error) {
        res.status(400).json({ err: true, msg: error.message });
    }
});

module.exports = router