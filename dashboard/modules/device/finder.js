var currnet_finder_device_identifier = '';

var FinderService = function() {

    this.sendShell = function(argShell) {
        service.pub.pubMessage('finder', 'commitShell', {deviceIdentifier: currnet_finder_device_identifier, shell: argShell});
    }

    this.updateResult = function(params) {
        if (params.deviceIdentifier == currnet_finder_device_identifier) {
            var text = $('#finder_cmd_screen').val() + params.result;
            $('#finder_cmd_screen').val(text);
            var textarea = document.getElementById('finder_cmd_screen');
            textarea.scrollTop = textarea.scrollHeight;
        }
    }
}
