var request = require('request');
var azureStorage = require("azure-storage");

function describeImage(fileName, context, callback) {
    const options = {
        uri: process.env.COMPUTER_VISION_API_ENDPOINT + "/describe", //'https://requestb.in/1izuyvd1'
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'Ocp-Apim-Subscription-Key': process.env.COMPUTER_VISION_KEY
        },
        json: true,
        body: { url: `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/images/${fileName}` }
    };
    request(options,
        function (error, response, body) {
            if (error) {
                throw `failed describing image [${fileName}] returned with error [${error}]`;
            }
            if (response.statusCode != "200") {
                throw `failed describing image [${fileName}] returned with code ${response.statusCode} (${response.statusMessage})`;
            }
            if (body.code) {
                throw `failed describing image [${fileName}] returned with code ${body.code}`;
            }
            var caption = body.description.captions[0].text;
            callback({description:caption, tags: body.description.tags, metadata:body.metadata});
        });
}

module.exports = {
    describeImage,
}