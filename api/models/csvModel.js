var mongoose = require('mongoose');

// Setup schema
var csvModel = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    filename: String,
    urls: String
});
// Export Contact model
var csvModelStore = module.exports = mongoose.model('csvModelStore', csvModel);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}