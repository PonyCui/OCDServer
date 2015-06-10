function render_HTTPWatcher_connection_update() {
    $.get('./modules/HTTPWatcher/connection.html', function(result){
        $('.HTTPWatcher_connection').html(result);
        var i = 0;
        $.each(service.HTTPWatcher.connections, function(k, v){
            var connectionItem = v;
            var connectionStatus = 'Pending';
            if (connectionItem.responseStatusCode.length > 0 &&
                connectionItem.responseStatusCode != '0') {
                connectionStatus = connectionItem.responseStatusCode;
            }
            $('.HTTPWatcher_connection').find('tbody').append('<tr><td>'+i+'</td><td>'+connectionItem.deviceIdentifier.substr(-6, 6)+'</td><td data-toggle="modal" data-target="#globalModal" onclick="loadModal(\'modules/HTTPWatcher/item.html\', render_HTTPWatcher_update_item_modal, {id:'+k+'})"><span class="text-info">'+connectionItem.requestURLString+'</span></td><td>'+connectionStatus+'</td></tr>');
            i++;
        });
    })
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
