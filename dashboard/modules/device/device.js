var DeviceEntity = function() {
    this.deviceIdentifier = '';
    this.deviceName = '';
    this.deviceSystemVersion = '';
    this.deviceModel = '';
    this.lastAck = 0;

    this.init = function(params) {
        this.deviceIdentifier = params.deviceIdentifier;
        this.deviceName = params.deviceName;
        this.deviceSystemVersion = params.deviceSystemVersion;
        this.deviceModel = params.deviceModel;
        this.lastAck = (new Date()).getTime();
    }
}

var DeviceService = function() {
    this.onlineDevices = {};

    this.updateDevice = function(params) {
        var deviceItem = new DeviceEntity;
        deviceItem.init(params);
        this.onlineDevices[deviceItem.deviceIdentifier] = deviceItem;
    }
}
