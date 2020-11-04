const mongoose = require('mongoose');

const ObjectId = mongoose.ObjectId;

const ModelSchema = new mongoose.Schema({
    _id : ObjectId,
    title : String,
    id : String,
    url : String,
    completed : Boolean
})

const Model = mongoose.model('video', ModelSchema);

module.exports = Model;