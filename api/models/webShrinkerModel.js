var mongoose = require('mongoose');

// Setup schema
var webShrinkerModel = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    filename : { 
        type : String,
        required : true
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