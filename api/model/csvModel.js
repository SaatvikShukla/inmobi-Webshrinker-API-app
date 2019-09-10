var mongoose = require('mongoose');

// Setup schema
var csvSchema = mongoose.Schema({
    fileContents: {
        type: String,
        required: true
    }
});
// Export Contact model
var csvFile = module.exports = mongoose.model('csvFile', csvSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}