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
        $('.HTTPWatcher_connection').find('tbody').prepend('<tr><td>'+device_id+'</td><td data-toggle="modal" data-target="#globalModal" onclick="loadModal(\'modules/HTTPWatcher/item.html\', render_HTTPWatcher_update_item_modal, {id:'+k+'})"><span class="text-info">'+urlString+'</span></td><td>'+connectionItem.requestMethod+'</td><td>'+connectionStatus+'</td><td>'+connectionItem.responseMIMEType+'</td><td>size</td><td>time</td></tr>');
        i++;
    });
}

function render_HTTPWatcher_update_item_modal(params) {
    var connectionItem = service.HTTPWatcher.connections[params.id];
    $('#globalModal').find('#request_url').val(connectionItem.requestURLString);
    $('#globalModal').find('#request_method').val(connectionItem.requestMethod);
    $('#globalModal').find('#request_header').val(connectionItem.requestHeader);
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
}

setInterval(render_HTTPWatcher_connection_update, 1000);
