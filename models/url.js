const mongoose = require('mongoose');
const sh = require('shorthash');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    title: {
        type: String,
    },
    original_url: {
        type: String,
        required: true
    },
    tags: [ String ],
    hashed_url: {
        type: String
    }
})

urlSchema.pre('save', function(next) {
    if(!this.hashed_url) {
        console.log(this.original_url);
        this.hashed_url = sh.unique(`${this.original_url}`);
    }
    next();
})

const Url = mongoose.model('Url', urlSchema);

module.exports = {
    Url
}