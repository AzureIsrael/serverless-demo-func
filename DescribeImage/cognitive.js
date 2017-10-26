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
    request(options,callback);
}

module.exports = {
    describeImage,
}