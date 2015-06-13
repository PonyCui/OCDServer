# OCDServer
The OCDebugger server side PHP code.

## Installing

### Your Server

1. Git clone the OCDServer repo.

2. Place OCDServer a httpd public directory.

3. Import ocdserver.sql to mysql

4. edit application/config/database.php

5. cmd ```cd socket``` ```php socket.php```

6. Done

### SAE (Sina Cloud)

1. Git clone the OCDServer repo.

2. Upload to SAE

3. Start service Channel/Memcache/Mysql/TaskQueue(name = push)

4. Import ocdserver.sql to mysql

5. Done
