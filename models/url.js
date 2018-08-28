const mongoose = require('mongoose');
const validator = require('validator');
const shortHash = require('shorthash');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    title: {
        type: String,
    },
    original_url: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return validator.isURL(value);
            },
            message: function(props) {
                return `${props.path} is Not Valid`;
            }
        }
    },
    tags: [ String ],
    hashed_url: {
        type: String
    }
})

urlSchema.pre('save', function(next) {
    if(!this.hashed_url) {
        this.hashed_url = shortHash.unique(`${this.original_url}`);
    }
    next();
})

// urlSchema.pre('save', function(next) {
//     let count = 0;
//     if(!this.pageCount) {
//         this.pageCount = count++;
//     }
//     next();
// })

const Url = mongoose.model('Url', urlSchema);

module.exports = {
    Url
}