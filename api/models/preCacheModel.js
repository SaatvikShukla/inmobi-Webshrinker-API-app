var mongoose = require('mongoose');

// Setup schema
var preCacheModel = mongoose.Schema({
    url: String,
    targetURL: String
});
// Export Contact model
var preCacheModelStore = module.exports = mongoose.model('preCacheModelStore', preCacheModel);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}