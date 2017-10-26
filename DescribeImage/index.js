var cognitive = require("./cognitive");

module.exports = function (context, input) {
    input.forEach(function (element) {
        var id = element.id;
        var fileName = element.fileName[0]._value;
        cognitive.describeImage(fileName, context,
            (result) => {
                context.log(result);
            }
        );

    }, this);

    context.done();
};