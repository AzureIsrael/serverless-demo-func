var cognitive = require("./cognitive");

module.exports = function (context, input) {
        context.log(input[0].id);
        context.log(input[0].fileName);
        context.log(input[0].fileSize);

        cognitive.describeImage('https://serverlessdemosa.blob.core.windows.net/images/' + input[0].fileName, (context, data) => {
                                    context.log(data);                                    
                                });

        /*
        context.bindings.document = {
            text : "I'm running in a JavaScript function! Data: '" + input + "'"
        }   
        */
        context.done();
    };