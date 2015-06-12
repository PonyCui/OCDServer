var HTTPWatcherConnectionEntity = function() {
    var _this = this;

    this.deviceIdentifier = '';
    this.orderID = '';
    this.requestURLString = '';
    this.requestDate = '';
    this.requestMethod = '';
    this.requestHeader = '';
    this.responseURLString = '';
    this.responseStatusCode = '';
    this.responseMIMEType = '';
    this.responseHeader = '';
    this.responseString = '';
    this.responseDataSize = '';
    this.timeUse = '';
    this.requestBody = '';
    this.isResendConnection = false;

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
        if (this.requestHeader.indexOf('_OCD.ResendConnection') >= 0) {
            this.isResendConnection = true;
        }
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

    this.requestResendConnection = function(params) {
        var requestParams = {
            deviceIdentifier:params.deviceIdentifier,
            orderID:params.orderID,
            requestURLString:params.requestURLString,
            requestMethod:params.requestMethod,
            requestHeader:params.requestHeader,
            requestBody:params.requestBody
        }
        service.pub.pubMessage('HTTPWatcher', 'resendConnection', requestParams);
    }
}
