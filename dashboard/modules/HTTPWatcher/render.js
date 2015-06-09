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
            $('.HTTPWatcher_connection').find('tbody').append('<tr><td>'+k+'</td><td>'+connectionItem.requestURLString+'</td><td>'+connectionStatus+'</td></tr>');
        });
    })
}

setInterval(render_HTTPWatcher_connection_update, 1000);
