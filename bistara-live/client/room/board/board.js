/**
 * Created by abe707 on 4/15/16.
 */
if(Meteor.isClient){

    Template.board.rendered = function(){
        Meteor.setInterval(function(){
            var pin = Router.current().params.pin;
            Meteor.call('get_board_state', pin, function(err,res) {
                console.log("get board state");
                if (err) console.log(err);
                else{
                    var canvas = document.getElementById("main-whiteboard");
                    var ctx = canvas.getContext("2d");

                    var image = new Image();
                    image.onload = function() {
                        ctx.drawImage(image, 0, 0);
                    };
                    image.src = res;
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
                    console.log(canvasX + " " + canvasY);
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
                    //TODO: Add here the storage of the canvas state to the backend.
                });
        }
        // Disable Page Move
        document.body.addEventListener('touchmove',function(evt){
            evt.preventDefault();
        },false);
    };
}