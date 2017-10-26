var cognitive = require("./cognitive");
var gremlin = require('gremlin');

module.exports = function (context, input) {
    input.forEach(function (element) {
        var id = element.id;
        var fileName = element.fileName[0]._value;
        context.log(`describing image [${fileName}] which connected to vertex [${id}]`);
        cognitive.describeImage(fileName, context,
            (result) => {
                context.log(`vertex [${id}] connected to image [${fileName}] described as [${result}], updating vertex...`);
                const client = gremlin.createClient(
                    443,
                    process.env["cosmosDbEndpoint"],
                    {
                        "session": false,
                        "ssl": true,
                        "user": `/dbs/${process.env["cosmosDbDatabase"]}/colls/${process.env["cosmosDbCollection"]}`,
                        "password": process.env["cosmosDbPrimaryKey"]
                    });

                client.execute(`g.V().has('id','${id}').property('description', '${result.description}').property('tags',${result.tags}).property('metadata',${result.metadata})`,
                    {}, (err, results) => {
                        if (err) throw `failed to update image description for vertex [${id}] returned with error ${err}`;
                        context.log(JSON.stringify(results));
                    });
            }
        );

    }, this);

    context.done();
};