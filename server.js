var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hi there! please Try the <a href="/index.html">Example Page</a></h1>');
            res.end();
            break;
        case '/index.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
        break;
        default: notFoundError(res);
    }
}),

notFoundError = function(res){
    res.writeHead(404);
    res.write("<h1>The page you were looking for doesn't exist.</h1>");
    res.write("<p>You may have mistyped the address or the page may have moved.</p>");
    res.write('404');
    res.end();
};

server.listen(3000);

// use socket.io
var io = require('socket.io').listen(server);
var sendData = false

// define interactions with client
io.sockets.on('connection', function(socket){
    //send data to client
    setInterval(function(){
        if(sendData){
            socket.emit('date', {'date': new Date()});
        }
    }, 1000);

    //recieve client data
    socket.on('client_data', function(data){
        if(data == '1'){
            //Start emiting date
            sendData = true
        }
        if(data == '0'){
            sendData = false;
        }
    });
});
