var cognitive = require("./cognitive");
var azureStorage = require("azure-storage");
var streamifier = require('streamifier');

module.exports = function (context, input) {
    input.forEach(function(element) {
        var id = element.id;
        var fileName = element.fileName[0]._value;
        cognitive.describeImage(fileName,
            context,
            function (error, response, body) {
                if (error) {
                  return context.log(error);
                }
                if (body.code) {
                    return context.log(body);
                }
                var caption = body.description.captions[0].text;
                context.log(caption);
              }
            );
    
    }, this);
    
    context.done();
};