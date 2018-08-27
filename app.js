const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const sh = require('shorthash');

const { Url } = require('./models/url');
const mongoose = require('./config/db');
const { urlRouter } = require('./routes/urls');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(morgan('short'));

app.use('/url',urlRouter);

app.get('/',(req,res) => {
    res.send({
        msg: "Welcome to the page .."
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})