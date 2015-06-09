var ConnService = function(){

    var _this = this;

    this.uri = "ws://localhost:9090/pubsub";
    this.conn = null;
    this.retryCount = 0;

    this.init = function() {
        if (window.location.href.indexOf('sinaapp.com') > 0) {
            $.get("/index.php/pubsub", function(result){
                _this.uri = result;
                _this.connect();
            })
        }
        else {
            _this.connect();
        }
    }

    this.connect = function() {
        try {
            _this.conn = new WebSocket(_this.uri);
            _this.configureHandler();
        } catch (e) {
            if (e) {
                _this.retry();
            }
        }
    }

    this.retry = function() {
        if (this.retryCount < 10) {
            this.retryCount++;
            setTimeout(this.init, 5000);
            service.console.log('Will reconnect after 5s.');
        }
    }

    this.configureHandler = function() {
        this.conn.onopen = function(e) {
            service.console.log('onopen');
            _this.retryCount = 0;
            service.sub.init();
        }

        this.conn.onclose = function(e) {
            service.console.log('onclose:'+e.code);
            _this.retry();
        }

        this.conn.onmessage = function(e) {
            service.console.log('onmessage:'+e);
            var msg;
            eval('msg = '+e.data);
            var _service = msg.s;
            var _method = msg.m;
            var _params = msg.p;
            if (_service in service) {
                if (_method in service[_service]) {
                    service[_service][_method](_params);
                }
            }
        }

        this.conn.onerror = function(e) {
            service.console.log('onerror:'+e);
        }
    }
}
