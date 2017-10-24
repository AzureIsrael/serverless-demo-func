var cognitive = require("./cognitive");
var azureStorage = require("azure-storage");
var streamifier = require('streamifier');

module.exports = function (context, input) {
    input.forEach(function(element) {
        var id = element.id;
        var fileName = element.fileName[0]._value;
        cognitive.generateThumbnail(fileName,100,100,context);
    }, this);

    context.done();
};