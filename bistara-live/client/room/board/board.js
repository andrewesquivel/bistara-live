/**
 * Created by abe707 on 4/15/16.
 */
if(Meteor.isClient){

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
                    //TODO: Add here the storage of the canvas state to the backend.
                });
        }
        // Disable Page Move
        document.body.addEventListener('touchmove',function(evt){
            evt.preventDefault();
        },false);
    };
}