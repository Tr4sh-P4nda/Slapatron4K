THREE.DefaultLoadingManager.onProgress = function(item, loaded, total) {
    var percent = loaded / total;
    if (percent > 0.75) {
        startBitchSlap();
    }
};

var started = false;

function startBitchSlap() {

    if (!started) {

        //Bitch slapatron 4,000
        var sim = altspace.utilities.Simulation();

        var geometry = new THREE.SphereGeometry(0.05, 5, 5);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        material.visible = false;
        var bitch_slap_hands = {};
        var bitch_slap = new THREE.Mesh(geometry, material);
        bitch_slap.position.z = 0;
        bitch_slap.position.y = 0;

        var skeleton;
        var hand;
        var should_send = false;
        var userIdent;

        sim.scene.add(bitch_slap);

        //Gotta give her what she wants. Bwahahaha!
        var socket = io.connect('http://hah.jacobralph.org:25543/');

        var promises = [altspace.getThreeJSTrackingSkeleton(), altspace.getEnclosure()];
        Promise.all(promises).then(function(array) {

            skeleton = array[0];
            sim.scene.add(skeleton);
            altspace.getUser().then(function(userInfo) {
                userIdent = userInfo.userId;
                hand = skeleton.getJoint('Middle', "Right", 2);
                if (hand != undefined) {
                    bitch_slap.userData.userId = userIdent;
                    bitch_slap.position.y = 0;
                    bitch_slap.position.z = 0;
                    hand.add(bitch_slap);
                    should_send = true;
                } else {
                    hand = skeleton.getJoint('Head');
                    if (hand != undefined) {
                        bitch_slap.userData.userId = userIdent;
                        bitch_slap.position.y = 0;
                        bitch_slap.position.z = 0;
                        hand.add(bitch_slap);
                        should_send = true;
                    }
                }
            });

        }).catch(function(err) {
            console.log('Well Jacob, you fucked something up: ', err);
        });

        function updateBitchHand(arr) {
            for(var key in arr){
                var data = arr[key];
                data.id = key;
                if (data != undefined && data.id != undefined && data.id != userIdent) {
                    if (bitch_slap_hands[data.id] != undefined) {

                        var bitch_hand = bitch_slap_hands[data.id];
                        move(bitch_hand, data);

                    } else {

                        var geometry_hand = new THREE.SphereGeometry(0.05, 5, 5);
                        var material_hand = new THREE.MeshBasicMaterial({
                            color: 0xffff00
                        });
                        material_hand.visible = false;
                        var bitch_hand = new THREE.Mesh(geometry_hand, material_hand);
                        bitch_hand.userData.userId = data.id;
                        bitch_hand.position.y = data.y;
                        bitch_hand.position.x = data.x;
                        bitch_hand.position.z = data.z;
                        var colliderBox = new NativeComponent('n-mesh-collider', {
                            type: "environment",
                            convex: true
                        }, bitch_hand);
                        sim.scene.add(bitch_hand);
                        bitch_slap_hands[data.id] = bitch_hand;

                    }
                }
            }
        }

        setInterval(function(e) {
            if (should_send) {
                if (hand != undefined) {
                    if (userIdent == undefined) {
                        userIdent = THREE.math.generateUUID();
                    }
                    socket.emit('update_position', {
                        position: {
                            x: hand.position.x,
                            y: hand.position.y,
                            z: hand.position.z
                        },
                        id: userIdent
                    });
                }
            }
        }, 100);

        var fps = 1000/20;

        function move(object, nPos){
            var time = Date.now();
            var oPos = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
            (function loop(){
                var progress = Date.now() - time;
                if(progress > fps) return;
                object.position.lerpVectors(oPos, nPos, progress/fps);
                requestAnimationFrame(loop);
            }());
        };

        socket.on('position', function(data) {
            if (data) {
                updateBitchHand(data);
            }
        });

        started = true;

    }

}