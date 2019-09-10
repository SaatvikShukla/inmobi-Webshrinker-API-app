var mongoose = require('mongoose');

// Setup schema
var webShrinkerModel = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    responseFromWS: {
        type: String,
    }
});
// Export Contact model
var webShrinkerModel = module.exports = mongoose.model('webShrinkerData', webShrinkerModel);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}