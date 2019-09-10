var mongoose = require('mongoose');

// Setup schema
var webShrinkerModel = mongoose.Schema({
    viedId : { 
        type : String,
        required : true,
        default : 0
    },
    domains: {
        type: String,
        required: true
    }
});
// Export Contact model
var webShrinkerModel = module.exports = mongoose.model('webShrinkerData', webShrinkerModel);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}