
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
            

            // check to see if image aleardy exists
            client.execute(`g.V().has('fileName','${imageDocument.fileName}')`,
            {}, (err, results) => {
                if (err) throw `failed to search image by file name [${imageDocument.fileName}] returned with error ${err}`;
                if (results && results.length > 0) {
                    context.log(`image [${imageDocument.fileName}] already exists in db`);
                    return;
                }

                // insert new vertext
                client.execute("g.addV('image').property('fileName', fileName).property('fileSize', fileSize)", 
                imageDocument, (err, results) => {
                 if (err) throw `failed to create vertex for image[${imageDocument.fileName}] returned with error ${err}`;
                 context.log(JSON.stringify(results));
             });

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