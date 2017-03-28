var io = require('socket.io')();
console.log("Running!");

var positions = {};

io.on('connection', function(socket) {  
    console.log("New Connection!");
    socket.on('update_position', function(data) {
    	if(data && data.position && data.id){
            position[id] = data.position;
    	}
    });
});

setInterval(function(e){
    io.emit('position', positions);
}, 50);

io.listen(25543);