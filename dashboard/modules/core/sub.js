var SubService = function(){

    var user_id = serviceAppID;

    var session_token = serviceTokenID;

    this.heartBeatTimer = null;

    this.heartBeatTimeoutTimer = null;

    this.init = function() {
        this.addObserver();
    }

    this.addObserver = function() {
        service.conn.conn.send('{"s":"sub", "m":"addObserver", "p": {"user_id":"'+user_id+'","session_token":"'+session_token+'"}}');
        clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = setInterval(this.heartBeat, 90000);
    }

    this.heartBeat = function() {
        service.conn.conn.send('{"s":"sub", "m":"heartBeat"}');
        this.heartBeatTimeoutTimer = setTimeout(this.heartBeatTimeout, 5000);
    }

    this.heartBeatTimeout = function() {
        service.console.log('[Error] fail to receive heart beat.');
        service.conn.conn.close();
    }

    this.didAddObserver = function() {
        service.console.log('didAddObserver');
    }

    this.didReceivedError = function(params) {
        alert(params.error_description);
        service.console.log('[Error] code:'+params.error_code+',desc:'+params.error_description);
    }

    this.didReceivedHeartBeat = function() {
        clearTimeout(this.heartBeatTimeoutTimer);
    }
}
