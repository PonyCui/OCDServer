var PubService = function() {

    this.pubMessage = function(theService, theMethod, theParams) {
        var json = {
            "s": "pub",
            "m": "submit",
            "p": {
                "service": theService,
                "method": theMethod,
                "params": theParams
            }
        };
        service.conn.conn.send(JSON.stringify(json));
    }
}
