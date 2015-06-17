var render_HTTPWatcher_filter = {
    device_id:null,
    url:null,
    method:null,
    status:null,
    type:null
};

function render_HTTPWatcher_connection_update() {
    if ($('#HTTPWatcher_connection_table').length > 0) {
        render_HTTPWatcher_connection_fill();
    }
    else {
        $.get('./modules/HTTPWatcher/connection.html', function(result){
            $('.HTTPWatcher_connection').html(result);
            render_HTTPWatcher_connection_fill();
        });
    }

}

function render_HTTPWatcher_connection_fill() {
    $('#HTTPWatcher_connection_table').find('tbody').empty();
    var i = 0;
    $.each(service.HTTPWatcher.connections, function(k, v){
        var connectionItem = v;
        var connectionStatus = 'Pending';
        if (connectionItem.responseStatusCode.length > 0 &&
            connectionItem.responseStatusCode != '0') {
            connectionStatus = connectionItem.responseStatusCode;
        }
        var urlString = connectionItem.requestURLString;
        if (urlString.length > 50) {
            urlString = urlString.substr(0, 24) + '...' + urlString.substr(-24, 24);
        }
        var device_id = connectionItem.deviceIdentifier.substr(-6, 6);
        if (render_HTTPWatcher_filter.device_id != null &&
            render_HTTPWatcher_filter.device_id.length > 0 &&
            render_HTTPWatcher_filter.device_id.toUpperCase() != device_id) {
            return;
        }
        if (render_HTTPWatcher_filter.url != null &&
            render_HTTPWatcher_filter.url.length > 0 &&
            connectionItem.requestURLString.indexOf(render_HTTPWatcher_filter.url) < 0) {
            return;
        }
        if (render_HTTPWatcher_filter.method != null &&
            render_HTTPWatcher_filter.method.length > 0 &&
            render_HTTPWatcher_filter.method.toUpperCase() != connectionItem.requestMethod) {
            return;
        }
        if (render_HTTPWatcher_filter.status != null &&
            render_HTTPWatcher_filter.status.length > 0 &&
            render_HTTPWatcher_filter.status != connectionItem.responseStatusCode) {
            return;
        }
        if (render_HTTPWatcher_filter.type != null &&
            render_HTTPWatcher_filter.type.length > 0 &&
            connectionItem.responseMIMEType.indexOf(render_HTTPWatcher_filter.type) < 0) {
            return;
        }

        var resendSign = 'class="text-info"';
        if (connectionItem.isResendConnection) {
            resendSign = 'class="text-danger"';
        }

        $('.HTTPWatcher_connection').find('tbody').prepend('<tr><td>'+device_id+'</td><td data-toggle="modal" data-target="#globalModal" onclick="loadModal(\'modules/HTTPWatcher/item.html\', render_HTTPWatcher_update_item_modal, {id:'+k+'})"><span '+resendSign+'>'+urlString+'</span></td><td>'+connectionItem.requestMethod+'</td><td>'+connectionStatus+'</td><td>'+connectionItem.responseMIMEType+'</td><td>'+connectionItem.responseDataSize+'</td><td>'+connectionItem.timeUse+'</td></tr>');
        i++;
    });
}

function render_HTTPWatcher_update_item_modal(params) {
    var connectionItem = service.HTTPWatcher.connections[params.id];
    $('#globalModal').find('#request_url').val(connectionItem.requestURLString);
    $('#globalModal').find('#request_method').val(connectionItem.requestMethod);
    $('#globalModal').find('#request_header').val(connectionItem.requestHeader);
    $('#globalModal').find('#request_body').val(connectionItem.requestBody);
    $('#globalModal').find('#response_url').val(connectionItem.responseURLString);
    $('#globalModal').find('#response_code').val(connectionItem.responseStatusCode);
    $('#globalModal').find('#response_MIMEType').val(connectionItem.responseMIMEType);
    $('#globalModal').find('#response_header').val(connectionItem.responseHeader);
    $('#globalModal').find('#response_text').val(connectionItem.responseString);
    var json = null;
    try {
        eval('json='+connectionItem.responseString);
    } catch (e) {
        $('#globalModal').find('#response_text').show();
        $('#globalModal').find('#jsoneditor').hide();
        $('#response_JSON_button').removeClass('btn-primary');
        $('#response_Text_button').addClass('btn-primary');
    } finally {
        if (json !== null) {
            $('#globalModal').find('#response_text').hide();
            $('#globalModal').find('#jsoneditor').show();
            $('#response_Text_button').removeClass('btn-primary');
            $('#response_JSON_button').addClass('btn-primary');
            jeditor.set(json);
        }
    }
    $('#resend_button').click(function(){
        var resendConnectionItem = new HTTPWatcherConnectionEntity;
        resendConnectionItem.init(connectionItem);
        resendConnectionItem.requestURLString = $('#request_url').val();
        resendConnectionItem.requestMethod = $('#request_method').val();
        resendConnectionItem.requestHeader = $('#request_header').val();
        resendConnectionItem.requestBody = $('#request_body').val();
        service.HTTPWatcher.requestResendConnection(resendConnectionItem);
        $('#globalModal').modal('hide');
    });
}

function fetchMappingData() {
    $.getJSON('../index.php/modifier/fetch?appid='+serviceAppID+'&apptoken='+serviceTokenID, function(result){
        $('#mapping').find('tbody').empty();
        for (var i = 0; i < result.length; i++) {
            var v = result[i];
            eval('var params = '+v.modifier_params);
            var validString = v.is_valid == '1' ? '<button type="button" class="btn btn-success btn-xs" onclick="invalidModifier(\''+v.modifier_id+'\')">Valid</button>' : '<button type="button" class="btn btn-default btn-xs" onclick="validModifier(\''+v.modifier_id+'\')">Invalid</button>';
            if (params.type == 'mapping') {
                $('#mapping').find('tbody').append('<tr><td>'+v.modifier_id+'</td><td>'+params.fromPattern+'</td><td>'+params.toPattern+'</td><td>'+validString+'</td><td><button class="btn btn-danger btn-xs" onclick="deleteModifier(\''+v.modifier_id+'\')">Delete</button></td></tr>');
            }
        }

    });
}

function submitMappingData() {
    updateMappingFromPattern();
    updateMappingToPattern();
    var params = JSON.stringify({
        'type': 'mapping',
        'fromPattern': $('#from_pattern').val(),
        'toPattern': $('#to_pattern').val()
    });
    var data = {
        'params': params
    }
    $.post('../index.php/modifier/add?appid='+serviceAppID+'&apptoken='+serviceTokenID, data, function(result){
        fetchMappingData();
    })
}

function invalidModifier(id) {
    $.get('../index.php/modifier/invalid?appid='+serviceAppID+'&apptoken='+serviceTokenID+'&id='+id, function(){
        fetchMappingData();
    })
}

function validModifier(id) {
    $.get('../index.php/modifier/valid?appid='+serviceAppID+'&apptoken='+serviceTokenID+'&id='+id, function(){
        fetchMappingData();
    })
}

function deleteModifier(id) {
    $.get('../index.php/modifier/delete?appid='+serviceAppID+'&apptoken='+serviceTokenID+'&id='+id, function(){
        fetchMappingData();
    })
}

setInterval(render_HTTPWatcher_connection_update, 1000);

$('#mappingModal').find('.from_use').click(function(){
    if ($(this).text() == 'Use Pattern') {
        $('#mappingModal').find('.from_detail').hide();
        $('#mappingModal').find('.from_pattern').show();
        $(this).text('Use Builder')
    }
    else {
        $('#mappingModal').find('.from_detail').show();
        $('#mappingModal').find('.from_pattern').hide();
        $(this).text('Use Pattern')
    }
})

$('#mappingModal').find('.to_use').click(function(){
    if ($(this).text() == 'Use Pattern') {
        $('#mappingModal').find('.to_detail').hide();
        $('#mappingModal').find('.to_pattern').show();
        $(this).text('Use Builder')
    }
    else {
        $('#mappingModal').find('.to_detail').show();
        $('#mappingModal').find('.to_pattern').hide();
        $(this).text('Use Pattern')
    }
})

$('#mappingModal').find('.from_detail:input').change(function(){
    updateMappingFromPattern();
})

$('#mappingModal').find('.from_detail').find('input').change(function(){
    updateMappingFromPattern()
})

function updateMappingFromPattern() {
    var scheme = $('#from_scheme').val();
    var host = $('#from_host').val();
    var port = $('#from_port').val();
    var path = $('#from_path').val();
    var query = $('#from_query').val();
    var pattern = '';
    if (scheme.length > 0) {
        pattern = '('+scheme+')://';
    }
    else {
        pattern = '([\\s\\S]+)://';
    }
    if (host.length > 0) {
        pattern = pattern + '('+host+')';
    }
    else {
        pattern = pattern + '([0-9a-zA-Z|.]+)'
    }
    if (port.length > 0) {
        pattern = pattern + '(:'+port+')';
    }
    else {
        pattern = pattern + '([^/]*)';
    }
    if (path.length > 0) {
        pattern = pattern + '('+path+')';
    }
    else {
        pattern = pattern + '([^?]+)';
    }
    if (query.length > 0) {
        pattern = pattern + '[\\?]*('+query+')';
    }
    else {
        pattern = pattern + '[\\?]*(.*)';
    }
    $('#from_pattern').val(pattern);
}

$('#mappingModal').find('.to_detail:input').change(function(){
    updateMappingToPattern();
})

$('#mappingModal').find('.to_detail').find('input').change(function(){
    updateMappingToPattern()
})

function updateMappingToPattern() {
    var scheme = $('#to_scheme').val();
    var host = $('#to_host').val();
    var port = $('#to_port').val();
    var path = $('#to_path').val();
    var query = $('#to_query').val();
    var pattern = '';
    if (scheme.length > 0) {
        pattern = scheme+'://';
    }
    else {
        pattern = '$1://';
    }
    if (host.length > 0) {
        pattern = pattern + host;
    }
    else {
        pattern = pattern + '$2';
    }
    if (port.length > 0) {
        pattern = pattern + ':'+port+'';
    }
    else {
        pattern = pattern + '$3';
    }
    if (path.length > 0) {
        pattern = pattern + path;
    }
    else {
        pattern = pattern + '$4';
    }
    if (query.length > 0) {
        pattern = pattern + '\\?' + query;
    }
    else {
        pattern = pattern + '?$5';
    }
    $('#to_pattern').val(pattern);
}
