/**
 * Created by abe707 on 4/15/16.
 */
if(Meteor.isClient){

    var canvasLocked = false;

    var obtainCanvasLock = function(from){
        while(canvasLocked == true){}
        canvasLocked = true;
    };

    var releaseCanvasLock = function(){
        canvasLocked = false;
    };


    Template.board.rendered = function(){
        Meteor.setInterval(function(){
            var pin = Router.current().params.pin;
            obtainCanvasLock(" interval ");
            Meteor.call('get_board_state', pin, function(err,res) {
                if (err) {
                    console.log(err);
                    releaseCanvasLock();
                }
                else{
                    var canvas = document.getElementById("main-whiteboard");
                    var ctx = canvas.getContext("2d");

                    var image = new Image();
                    image.src = res;
                    image.onload = function() {
                        ctx.drawImage(image, 0, 0);
                        releaseCanvasLock();
                    };

                }

            })}, 1500);
    };

    addBoard = function(){
        var myCanvas = document.getElementById("main-whiteboard");
        var ctx = myCanvas.getContext("2d");

        // Fill Window Width and Height - 8.5" by 11" ratio
        myCanvas.width = '595';
        myCanvas.height = '770';

        // Set Background Color
        ctx.fillStyle="#fff";
        ctx.fillRect(0,0,myCanvas.width,myCanvas.height);

        // Mouse Event Handlers
        if(myCanvas){
            var isDown = false;
            var canvasX, canvasY;
            ctx.lineWidth = 1;

            $(myCanvas)
                .mousedown(function(e){
                    isDown = true;
                    ctx.beginPath();
                    canvasX = e.pageX - myCanvas.offsetLeft;
                    canvasY = e.pageY - myCanvas.offsetTop;
                    ctx.moveTo(canvasX, canvasY);
                })
                .mousemove(function(e){
                    if(isDown !== false) {
                        canvasX = e.pageX - myCanvas.offsetLeft;
                        canvasY = e.pageY - myCanvas.offsetTop;
                        ctx.lineTo(canvasX, canvasY);
                        ctx.strokeStyle = "#000";
                        ctx.stroke();
                    }
                })
                .mouseup(function(e){
                    isDown = false;
                    ctx.closePath();
                    var dataURL = myCanvas.toDataURL();
                    Meteor.call("set_board_state", Session.get("pin"), dataURL, function(err, result){
                        if(err) console.log(err);
                    });
                });
        }
        // Disable Page Move
        document.body.addEventListener('touchmove',function(evt){
            evt.preventDefault();
        },false);
    };

    $(document).on('click', '#erase-board-button', function (e) {
        console.log("User is trying to erase the board");
        var myCanvas = document.getElementById("main-whiteboard");
        var ctx = myCanvas.getContext("2d");

        // Set Background Color
        ctx.fillStyle="#fff";
        ctx.fillRect(0,0,myCanvas.width,myCanvas.height);

        var dataURL = myCanvas.toDataURL();
        Meteor.call("set_board_state", Session.get("pin"), dataURL, function(err, result){
            if(err) console.log(err);
        });
    });

    $(document).on('click', "#upload-file", function(e){
        console.log("input");
        var x = document.getElementById("upload-file");
        var canvas = document.getElementById("main-whiteboard");
        var ctx = canvas.getContext("2d");

        var image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
        };
        image.src = x.src;
    });

    var min = function(a,b){
        if(a <= b) return a;
        return b;
    };

    $(document).on('click','#post-file', function(e){
        e.preventDefault();
        console.log("input form");
        var file = document.getElementById("upload-file").files[0];
        console.log(file);
        obtainCanvasLock("file");
        var canvas = document.getElementById("main-whiteboard");
        var ctx = canvas.getContext("2d");

        var FR= new FileReader();
        FR.onload = function(e) {
            var image = new Image();
            image.src       = e.target.result;
            image.onload = function() {
                ctx.drawImage(image, 0, 0, min(canvas.width, image.width),min(canvas.height, image.height));
                console.log("calling meteor method");
                Meteor.call("set_board_state", Session.get("pin"), canvas.toDataURL(), function(err, result){
                    if(err) console.log(err);
                    releaseCanvasLock();
                });
            };
        };
        FR.readAsDataURL(file);
    });


    Template.board.events({
        'submit form':function(e){
            e.preventDefault();
            console.log("input form");
            var file = document.getElementById("upload-file").files[0];
            console.log(file);
            obtainCanvasLock("file");
            var canvas = document.getElementById("main-whiteboard");
            var ctx = canvas.getContext("2d");

            var FR= new FileReader();
            FR.onload = function(e) {
                var image = new Image();
                image.src       = e.target.result;
                image.onload = function() {
                    ctx.drawImage(image, 0, 0, min(canvas.width, image.width),min(canvas.height, image.height));
                    console.log("calling meteor method");
                    Meteor.call("set_board_state", Session.get("pin"), canvas.toDataURL(), function(err, result){
                        if(err) console.log(err);
                        releaseCanvasLock();
                    });
                };
            };
            FR.readAsDataURL(file);



        }
    });



}