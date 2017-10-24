var request = require('request-promise').defaults({
    encoding: null
});

const headers = {
    'Content-Type': "application/octet-stream",
    'Ocp-Apim-Subscription-Key': process.env.COMPUTER_VISION_KEY
};

function describeImage(url, context, callback) {
    const options = {
        uri: process.env.COMPUTER_VISION_API_ENDPOINT + "/describe",
        method: "POST",
        headers,
        json: true,
        formData: {
            body: { url: url }
        }
    };
    var result = request(options);
    result.then(res => {
        var caption = res.description.captions[0].text;
        
        callback(context, caption);
        
    }).catch(function(err) {
        // Crawling failed or Cheerio choked...
        console.log(err);
    });
}

function ocr(stream, language, callback) {
    const options = {
        uri: process.env.COMPUTER_VISION_API_ENDPOINT + "/ocr",
        headers,
        json: true,
        method: "POST",
        formData: {
            body: stream
        }

    };
    var result = request(options);
    result.then((res) => {
        let text = '';
        if (res.regions.length > 0) {
            text = extractText(res.regions);
        }

        callback(text);
    }).catch(function(err) {
        // Crawling failed or Cheerio choked...
        console.log(err);
    });


}

function extractText(regions) {
    let output = '';
    regions.forEach(region => {
        region.lines.forEach(line => {
            line.words.forEach(word => {
                output += word.text + " ";
            });
        });
    });


    return output;
}

module.exports = {
    describeImage,
    ocr
}