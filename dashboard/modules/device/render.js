function render_device_update() {
    $.get('./modules/device/device.html', function(result){
        $('.overview_device').html(result);
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
            $('.overview_device').find('tbody').append('<tr><td>'+i+'</td><td>'+deviceItem.deviceIdentifier.substr(-6, 6)+'</td><td>'+deviceItem.deviceName+'</td><td>'+deviceItem.deviceSystemVersion+'</td><td>'+deviceItem.deviceModel+'</td><td>'+timeOffset+'</td></tr>');
            i++;
        });
    })
}

setInterval(render_device_update, 1000);
