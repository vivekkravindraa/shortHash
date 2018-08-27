const express = require('express');
const { Url } = require('../models/url');
const mongoose = require('../config/db');
const _ = require('lodash');

const router = express.Router();

router.get('/',(req,res) => {
    Url.find()
    .then((urls) => {
        res.send({
            urls,
            notice: 'Displaying all the urls'
        });
    })
    .catch((err) => {
        res.send(err);
    });
});

router.get('/:hash',(req,res) => {
    let hash = req.params.hash;

    Url.findOne({hashed_url: hash})
    .then((url) => {
        res.send({
            url,
            notice: 'Displaying one url record'
        });
    })
    .catch((err) => {
        res.send(err);
    });
});

router.post('/',(req,res) => {
    let body = _.pick(req.body, ['title','original_url','tags']);
    let url = new Url(body);
    
    url.save()
    .then((url) => {
        res.send({
            url,
            notice: 'Successfully created an url record'
        })
    })
    .catch((err) => {
        res.send(err);
    })
})

router.put('/:id',(req,res) => {
    let id = req.params.id;
    let body = req.body;
    
    Url.findOneAndUpdate(id, body)
    .then((url) => {
        res.send({
            url,
            notice: 'Successfully updated an url record'
        })
    })
    .catch((err) => {
        res.send(err);
    })
})

router.delete('/:id',(req,res) => {
    let id = req.params.id;
    
    Url.findOneAndRemove(id)
    .then((url) => {
        res.send({
            url,
            notice: 'Successfully deleted an url record'
        })
    })
    .catch((err) => {
        res.send(err);
    })
})

module.exports = {
    urlRouter: router
}