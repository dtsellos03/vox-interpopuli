
module.exports =

    function CommentSearch(searchTerm, callback, firstcallback) {
        
    var request = require('es6-request');
     var baseURL = "https://vox-interpopuli-dtsellos03.c9users.io";

        const loadingObj = [{
            text: 'Loading!',
            value: 1000
        }, {
            text: 'Loading!',
            value: 1000
        }, {
            text: 'Loading!',
            value: 1000
        }, {
            text: 'Loading!',
            value: 1000
        }]

        console.log(searchTerm)
        console.log(this.state)
        this.setState({
            selectedAnalysis: {
                kind: "LOADING",
                data: [{
                    text: 'Search!',
                    value: 1000
                }]
            }
        });
        /// this.setState({ selectedAnalysis: [{ text: 'Loading!', value: 1000 }] })


        request.get(baseURL + '/test/'+encodeURI(searchTerm))
            .then(([bodytest, res]) => {
           
                var returnObj = JSON.parse(bodytest).obj
                callback(returnObj);
            });




       



        return null




    }