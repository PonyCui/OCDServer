var LogService = function() {

    this.devices = {}

    this.updateLog = function(params) {
        if (this.devices[params.deviceIdentifier] == undefined) {
            this.devices[params.deviceIdentifier] = [];
        }
        this.devices[params.deviceIdentifier].push(params);
        render_log_update(params);
    }
}
