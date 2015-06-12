var currnet_finder_device_identifier = '';
var current_finder_under_viMode = false;
var current_finder_viMode_filePath = '';

var FinderService = function() {

    this.subPaths = [];

    this.sendRequireSubPaths = function() {
        service.pub.pubMessage('finder', 'requireSubPaths', {deviceIdentifier: currnet_finder_device_identifier});
    }

    this.updateSubPaths = function(params) {
        if (params.deviceIdentifier == currnet_finder_device_identifier) {
            this.subPaths = params.subPaths;
        }
    }

    this.sendShell = function(argShell) {
        if (current_finder_under_viMode) {
            if (argShell == ':w') {
                //save
                service.pub.pubMessage('finder', 'saveViContent', {deviceIdentifier: currnet_finder_device_identifier, filePath:current_finder_viMode_filePath, fileContent:$('#finder_vi_screen').val()});
            }
            if (argShell == ':q') {
                //exit
                current_finder_under_viMode = false;
                $('#finder_cmd_screen').show();
                $('#finder_vi_screen').hide();
            }
            return;
        }
        if (argShell == 'clear') {
            var text = $('#finder_cmd_screen').val('');
            return;
        }
        service.pub.pubMessage('finder', 'commitShell', {deviceIdentifier: currnet_finder_device_identifier, shell: argShell});
    }

    this.updateResult = function(params) {
        if (params.deviceIdentifier == currnet_finder_device_identifier) {
            var text = $('#finder_cmd_screen').val() + params.result;
            $('#finder_cmd_screen').val(text);
            var textarea = document.getElementById('finder_cmd_screen');
            textarea.scrollTop = textarea.scrollHeight;
            this.sendRequireSubPaths();
        }
    }

    this.viMode = function(params) {
        if (params.deviceIdentifier == currnet_finder_device_identifier) {
            current_finder_under_viMode = true;
            current_finder_viMode_filePath = params.filePath;
            $('#finder_vi_screen').val(params.fileContent);
            $('#finder_cmd_screen').hide();
            $('#finder_vi_screen').show();
        }
    }
}
