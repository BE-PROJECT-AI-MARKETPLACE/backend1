const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listenting on Port ${port}`);
});

app.use(routes);