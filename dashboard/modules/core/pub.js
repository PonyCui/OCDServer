var PubService = function() {
    this.submit = function(text) {
        service.conn.conn.send('{"s":"pub", "m":"submit", "p": {"user_id": "1", "service": "test", "method": "test", "params":{"text": "'+text+'"}}}');
    }
}
