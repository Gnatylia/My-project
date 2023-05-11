const { connect } = require("mongoose");


module.exports = {
    connect_to_mongo: async () => {
        try {
            await connect("mongodb://localhost/Shopping", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true
            });
            // await connect("mongodb://localhost:27017/Shopping", {
            //     useNewUrlParser: true,
            //     user: "shoppUser",
            //     pass: "user:adminShopp",
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            //     useFindAndModify: true
            // });
            console.log("Connected to mongo");
        } catch (err) {
            console.log("Connection to mongo failed, err = ", err);
        }
    }
}