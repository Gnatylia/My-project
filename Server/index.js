const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const usersRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product");
const pictureRoutes = require("./routes/pictures");
const { cartesRoutes } = require("./routes/cartes");
const orderRoutes = require("./routes/order");
const { connect_to_mongo } = require("./db/database");

const app = express();
connect_to_mongo();
dotenv.config();

// midlewares
app.use(cors());
app.use(express.json());
//app.use(express.bodyParser());
app.use((req, res, next) => {
    console.log(req.method, ": ", req.url);
    next();
})

app.use('/users', usersRoutes);
app.use('/product', productRoutes);
app.use('/pictures', pictureRoutes);
app.use('/cartes', cartesRoutes);
app.use('/order', orderRoutes);
app.use('/orders', express.static('orders'));

app.get('/', (req, res) => {
    //res.send("<h1>Shopping Server API</h1>");
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname + '/Upload.html'));
});

app.listen(process.env.PORT, () => console.log("server listen port http://localhost:" + process.env.PORT));