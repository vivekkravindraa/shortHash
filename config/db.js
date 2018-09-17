const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://localhost:27017/shorturl`, {useNewUrlParser: true})
.then(() => {
    console.log('Connected to db: shorturl');
})
.catch((err) => {
    res.send(err);
})
mongoose.set('useCreateIndex', true);

module.exports = mongoose;