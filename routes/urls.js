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

router.get('/tags', (req,res) => {
    let names = req.query.names;
    
    let values = names.split(',');

    Url.find({tags: {"$all": values }})
    .then((urls) => {
        res.send(urls);
    })
    .catch((err) => {
        res.send(err);
    })
});

// Response is redirected to original_url
router.get('/:hash',(req,res) => {
    let hash = req.params.hash;

    Url.findOne({hashed_url: hash})
    .then((url) => {
        res.redirect(`${url.original_url}`);
    })
    .catch((err) => {
        res.send(err);
    })
});

router.get('/tags/:name',(req,res) => {
    let name = req.params.name;

    Url.find({ tags: name})
    .then((urls) => {
        res.send({
            urls
        })
    })
    .catch((err) => {
        res.send(err);
    })
});

// Mongo-db's array update method: $PUSH
router.get('/hashed_url/:hash',(req,res) => {
    let hash = req.params.hash;
    let body = {
        ipAddress: req.ip,
        browserName: req.useragent.browser,
        osType: req.useragent.os,
        deviceType: req.useragent.isDesktop ? 'Desktop' : 'Mobile'
    }
    Url.findOneAndUpdate({hashed_url: hash}, {$push: {clicks: body }}, {new: true})
    .then((url) => {
        res.send(url);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.post('/',(req,res) => {
    let body = _.pick(req.body, ['title','original_url','tags','clicks']);
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
});

router.put('/:id',(req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['title','tags','clicks']);
    
    Url.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((url) => {
        res.send({
            url,
            notice: 'Successfully updated an url record'
        })
    })
    .catch((err) => {
        res.send(err);
    })
});

router.delete('/:id',(req,res) => {
    let id = req.params.id;
    
    Url.findByIdAndRemove(id)
    .then((url) => {
        res.send({
            url,
            notice: 'Successfully deleted an url record'
        })
    })
    .catch((err) => {
        res.send(err);
    })
});

module.exports = {
    urlRouter: router
}