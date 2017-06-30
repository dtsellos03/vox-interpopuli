module.exports = function RoughSearch (searchTerm) {
    
    const request = require("es6-request");

const api_key = require( '../api_key.js');
    
  let searchURL = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&textFormat=plainText&part=snippet&q=' + searchTerm + '&type=video&maxResults=50'

    request.get(searchURL)
    .then(([body, res]) => {
        let videoIDs = []
        let parsed = JSON.parse(body)
        parsed.items.forEach(function(element) {
            videoIDs.push(element.id.videoId);
        })
        console.log(videoIDs)
        this.setState({ selectedAnalysis: "MEOWWW" })
    })
}