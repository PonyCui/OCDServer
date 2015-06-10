var PointDeviceEntity = function() {
    this.deviceIdentifier = '';
    this.points = [];
}

var PointEntity = function() {
    this.pointIdentifier = '';
    this.pointValue = 0;
    this.pointObject = '';
    this.isValid = false;

    this.init = function(params) {
        this.pointIdentifier = params.pointIdentifier;
        this.pointValue = parseInt(params.pointValue);
        this.pointObject = params.pointObject;
        this.isValid = params.isValid;
    }
}

var PointService = function() {

    this.devices = {};

    this.sendPointRequest = function() {
        service.pub.pubMessage('point', 'requestPoints', {});
    }

    this.updatePoints = function(params) {
        var deviceItem = new PointDeviceEntity;
        deviceItem.deviceIdentifier = params.deviceIdentifier;
        var points = [];
        for (var i = 0; i < params.points.length; i++) {
            var pointItem = new PointEntity;
            pointItem.init(params.points[i]);
            points.push(pointItem);
        }
        deviceItem.points = points;
        this.devices[deviceItem.deviceIdentifier] = deviceItem;
        render_update_device_points(deviceItem.deviceIdentifier);
    }

    this.sendValidPoint = function(deviceIdentifier, pointIdentifier) {
        service.pub.pubMessage('point', 'validPoint', {"id": pointIdentifier});
    }

    this.sendInvalidPoint = function(deviceIdentifier, pointIdentifier) {
        service.pub.pubMessage('point', 'invalidPoint', {"id": pointIdentifier});
    }
}
