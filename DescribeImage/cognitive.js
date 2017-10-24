var request = require('request');
var azureStorage = require("azure-storage");

function generateThumbnail(fileName, width, height, context) {
    const options = {
        uri: `${process.env.COMPUTER_VISION_API_ENDPOINT}/generateThumbnail`, //'https://requestb.in/1izuyvd1'
        qs: {
            width: width,
            height: height,
            smartCropping: true
        },
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'Ocp-Apim-Subscription-Key': process.env.COMPUTER_VISION_KEY
        },
        json: true,
        body: { url: `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/images/${fileName}` }
    };
    request(options)
        .on('error', function (err) {
            throw err;
        })
        .on('end', function () {
            console.log(["Created ", fileName, " thumbnail."].join(''));
        }).pipe(saveThumbnailToAzure(context, fileName));

}

function saveThumbnailToAzure(context, fileName) {
    var retryOperations = new azureStorage.ExponentialRetryPolicyFilter();
    var blobService = azureStorage.createBlobService().withFilter(retryOperations);

    return blobService
        .createWriteStreamToBlockBlob('thumbnails', fileName)
        .on('error', function (err) {
            throw err;
        })
        .on('end', function () {
            context.log(["Uploaded ", fileName, " image to 'thumbnails' container on Azure."].join(''));
        });
}

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
    generateThumbnail
}