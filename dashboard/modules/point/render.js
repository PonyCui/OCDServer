var current_point_device_identifier = '';

function render_update_device_points(device_identifier) {
    var tableBody = $('#globalModal').find('#point').find('tbody');
    tableBody.empty();
    if (device_identifier == current_point_device_identifier) {
        var deviceItem = service.point.devices[device_identifier];
        var pointItems = deviceItem.points;
        for (var i = 0; i < pointItems.length; i++) {
            var pointItem = pointItems[i];
            var validString = pointItem.isValid ? '<button type="button" class="btn btn-success btn-xs" onclick="service.point.sendInvalidPoint(\''+deviceItem.deviceIdentifier+'\',\''+pointItem.pointIdentifier+'\')">Valid</button>' : '<button type="button" class="btn btn-default btn-xs" onclick="service.point.sendValidPoint(\''+deviceItem.deviceIdentifier+'\',\''+pointItem.pointIdentifier+'\')">Invalid</button>';
            tableBody.append('<tr><td>'+pointItem.pointIdentifier+'</td><td>'+pointItem.pointValue+'</td><td>'+pointItem.pointObject+'</td><td>'+validString+'</td></tr>');
        }
    }
}
