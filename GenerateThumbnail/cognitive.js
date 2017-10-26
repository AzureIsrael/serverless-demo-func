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
            throw `failed generate thumbnail for ${fileName} return with err ${err}`;
        })
        .on('response', function (response) {
            if (response.statusCode != "200") {
                throw `failed generate thumbnail for ${fileName} returned with code ${response.statusCode} (${response.statusMessage})`;
            }
            context.log(`Created thumbnail for ${fileName}`);
        }).pipe(saveThumbnailToAzure(context, fileName));

}

function saveThumbnailToAzure(context, fileName) {
    var retryOperations = new azureStorage.ExponentialRetryPolicyFilter();
    var blobService = azureStorage.createBlobService().withFilter(retryOperations);

    return blobService
        .createWriteStreamToBlockBlob('thumbnails', fileName)
        .on('error', function (err) {
            throw `failed storing thumbnail for ${fileName} return with err ${err}`;
        })
        .on('response', function () {
            if (response.statusCode != "200") {
                throw `failed generate thumbnail for ${fileName} returned with code ${response.statusCode} (${response.statusMessage})`;
            }
            context.log(`Uploaded thumbnail for ${fileName}`);
        });
}

module.exports = {
    generateThumbnail
}