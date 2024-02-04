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
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listenting on Port ${port}`);
});

app.use(routes);