
var gremlin = require('gremlin');

module.exports = function (context, imageBlob) {
    try {
        var imageDocument = {
            fileName: context.bindingData.name,
            fileSize: imageBlob.length
        };

        context.log(JSON.stringify(imageDocument));

        const client = gremlin.createClient(
            443, 
            process.env["cosmosDbEndpoint"], 
            { 
                "session": false, 
                "ssl": true, 
                "user": `/dbs/${process.env["cosmosDbDatabase"]}/colls/${process.env["cosmosDbCollection"]}`,
                "password": process.env["cosmosDbPrimaryKey"]
            });
            
            client.execute("g.addV('image').property('fileName', fileName).property('fileSize', fileSize)", 
               imageDocument, (err, results) => {
                if (err) return console.error(err);
                console.log(JSON.stringify(results));
            });

        /* bug in sdk
        context.bindings.imageDocument = {
            fileName: context.bindingData.name,
            fileSize: imageBlob.length
        }*/
        context.done();
    }
    catch (err) {
        context.log(err);
    }
};