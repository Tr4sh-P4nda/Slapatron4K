var io = require('socket.io')();
console.log("Running!");
io.on('connection', function(socket) {  
console.log("New Connection!");

    socket.on('update_position', function(data) {
    	if(data && data.position && data.id){
    		var position_x = data.position.x;
    		var position_y = data.position.y;
    		var position_z = data.position.z;
            var userId = data.id;
    		var send = {x: position_x, y: position_y, z: position_z, id: userId};
    		io.emit('position', send);
    	}
    });

});
io.listen(25543);