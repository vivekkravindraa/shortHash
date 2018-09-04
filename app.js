const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const validator = require('validator');
const shortHash = require('shorthash');
const useragent = require('express-useragent');

const fs = require('fs-extra');
const morgan = require('morgan');
const path = require('path');

const { Url } = require('./models/url');
const { User } = require('./models/user');
const mongoose = require('./config/db');

const { urlsRouter } = require('./routes/urls');
const { usersRouter } = require('./routes/users');

const app = express();
const port = 3000;

app.use(useragent.express());

app.use(bodyParser.json());

// ACCESS LOGGER MIDDLEWARE
// create a write stream (in append mode)
let accessLogStream = fs.createWriteStream(path.join('./logs', 'access.log'), {flags: 'a'});

// setup the logger
// app.use(morgan('combined', {stream: accessLogStream})); // OR
app.use(morgan(function (tokens, req, res) {
    return [`Started ${tokens.method(req, res)} ${tokens.url(req, res)} for ${req.ip} at ${new Date()} completed ${tokens.status(req, res)} in ${tokens['response-time'](req, res)} ms \n`]
}, {stream: accessLogStream}));

// CUSTOM LOGGER MIDDLEWARE
// Started :method :url for :ip_address at :datetime Completed :status in :response-time
app.use(morgan(function (tokens, req, res) {
    return [`Started ${tokens.method(req, res)} ${tokens.url(req, res)} for ${req.ip} at ${new Date()} completed ${tokens.status(req, res)} in ${tokens['response-time'](req, res)} ms`]
}));

app.use('/urls',urlsRouter);
app.use('/users',usersRouter);

app.get('/',(req,res) => {
    res.send(req.useragent);
})

app.use(function(req, res, next) {
    res.status(404);
    res.send({
        error: '404 : The resource you are looking for doesn’t exist.'
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})