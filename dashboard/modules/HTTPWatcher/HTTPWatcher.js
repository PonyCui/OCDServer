var HTTPWatcherConnectionEntity = function() {
    var _this = this;

    this.orderID = '';
    this.requestURLString = '';
    this.requestDate = '';
    this.requestMethod = '';
    this.responseURLString = '';
    this.responseStatusCode = '';
    this.responseMIMEType = '';
    this.responseHeader = '';
    this.responseString = '';

    this.init = function(params) {
        $.each(params, function(k, v){
            if (v.length > 0) {
                try {
                    eval('_this.'+k+'=v');
                } catch (e) {

                } finally {

                }
            }
        });
    }
}

var HTTPWatcherService = function() {
    this.connections = {};

    this.updateConnection = function(params) {
        var connectionItem;

        if (typeof this.connections[params.orderID] != undefined &&
            this.connections[params.orderID] != undefined) {
            connectionItem = this.connections[params.orderID];
            connectionItem.init(params);
        }
        else {
            connectionItem = new HTTPWatcherConnectionEntity;
            connectionItem.init(params);
        }
        this.connections[params.orderID] = connectionItem;
    }
}
