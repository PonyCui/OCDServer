var current_log_device_identifier = '';

function render_log_update(params) {
    if (params.deviceIdentifier == current_log_device_identifier) {
        var logs = service.log.devices[current_log_device_identifier];
        var text = '';
        for (var i = 0; i < logs.length; i++) {
            var logBody = logs[i].logBody;
            text = text + logBody;
        }
        $('#device_log').val(text);
    }
}
