const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const routes = require('./routes/routes');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST","PUT","DELETE"],
        credentials: true,
    })
);
app.use(
    session({
        key: "userId",
        secret: "aimarketplace",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure : false,
            expires: 60 * 60 * 24 * 1000 * 3,
        },
    })
);
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listenting on Port ${port}`);
});

app.use(routes);