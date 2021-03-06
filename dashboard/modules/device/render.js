var deviceTpl = '';

$.get('./modules/device/device.html', function(result){
    deviceTpl = result;
})

function render_device_update() {
    $('.overview_device').html(deviceTpl);
    var i = 0;
    $.each(service.device.onlineDevices, function(k, v){
        var deviceItem = v;
        var timeOffset = ((new Date()).getTime() - deviceItem.lastAck) / 1000;
        if (timeOffset > 20) {
            timeOffset = '<span style="color:red">lost</span>';
        }
        else {
            timeOffset = timeOffset + 's before';
        }
        $('.overview_device').find('tbody').append('<tr><td>'+i+'</td><td data-toggle="modal" data-target="#globalModal" onclick="loadModal(\'modules/device/item.html\', render_device_item_update, {id:\''+k+'\'})"><span class="text-info">'+deviceItem.deviceIdentifier.substr(-6, 6)+'</span></td><td>'+deviceItem.deviceName+'</td><td>'+deviceItem.deviceSystemVersion+'</td><td>'+deviceItem.deviceModel+'</td><td>'+timeOffset+'</td></tr>');
        i++;
    });
}

function render_device_item_update(params) {
    var deviceItem = service.device.onlineDevices[params.id];
    current_point_device_identifier = params.id;
    current_log_device_identifier = params.id;
    currnet_finder_device_identifier = params.id;
    $('#deviceIdentifier').val(deviceItem.deviceIdentifier);
    $('#deviceName').val(deviceItem.deviceName);
    $('#deviceSystemVersion').val(deviceItem.deviceSystemVersion);
    $('#deviceModel').val(deviceItem.deviceModel);
    service.point.sendPointRequest();
    render_log_update({deviceIdentifier: params.id});
}

setInterval(render_device_update, 1000);
