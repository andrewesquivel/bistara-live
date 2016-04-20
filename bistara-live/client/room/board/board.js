/**
 * Created by abe707 on 4/15/16.
 */
LineStream = new Meteor.Stream('lines');
if(Meteor.isClient){
    var pad;
    var remotePad;

    //var from = {x:0,y:0};
    //var to = {x:0,y:0};
    //var ctx;
    //var myCanvas;

    addBoard = function(){
        myCanvas = document.getElementById("main-whiteboard");
        ctx = myCanvas.getContext("2d");

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
                    from.x = e.pageX - myCanvas.offsetLeft;
                    from.y = e.pageY - myCanvas.offsetTop;
                    ctx.moveTo(from.x, from.y);
                    console.log(from);
                })
                .mousemove(function(e){
                    if(isDown !== false) {
                        to.x = e.pageX - myCanvas.offsetLeft;
                        to.y = e.pageY - myCanvas.offsetTop;
                        drawLine(from, to, '#777777');
                        from = to;
                    }
                })
                .mouseup(function(e){
                    isDown = false;
                    //ctx.closePath();
                    //TODO: Add here the storage of the canvas state to the backend.
                });
        }
        // Disable Page Move
        document.body.addEventListener('touchmove',function(evt){
            evt.preventDefault();
        },false);
    };

    var drawLine = function(from, to, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.closePath();
        ctx.stroke();
    };

    //addBoard = function(){
    //    Deps.autorun(function() {
    //        if(pad) {
    //            pad.close();
    //            remotePad.close();
    //        }
    //
    //        var padId = Router.current().params.pin;
    //        pad = new Pad(padId);
    //        remotePad = new RemotePad(padId, pad);
    //    });
    //};

    var RemotePad = function RemotePad(padId, pad) {
        var users = {};

        //listening on the dragstart event for the given padId
        LineStream.on(padId + ':dragstart', function (nickname, position, color) {
            console.log("line stream dragstart");
            //display the nickname pointer on the screen as remote user draws on the pad
            var pointer = $($('#tmpl-nickname').text());
            pointer.text(nickname);
            positionPointer(pointer, position);

            $('body').append(pointer);

            users[nickname] = {
                color: color,
                from: position,
                pointer: pointer
            };
        });

        //listening on the dragend event for the given padId
        LineStream.on(padId + ':dragend', function (nickname) {
            //cleaning at the dragend
            console.log("line stream dragend");
            var user = users[nickname];
            if (user) {
                user.pointer.remove();
                users[nickname] = undefined;
            }
        });

        //listening on the drag event for the given padId
        LineStream.on(padId + ':drag', function (nickname, to) {
            var user = users[nickname];
            if (user) {
                //when remote user is dragging, do the same here and re-position the nickname pointer
                pad.drawLine(user.from, to, user.color);
                positionPointer(user.pointer, to);
                user.from = to;
            }
        });

        // listening on the wipe event and wipe the blackboard
        LineStream.on(padId + ':wipe', function (nickname) {
            pad.wipe();
        });

        function positionPointer(pointer, position) {
            pointer.css({
                top: position.y + 10,
                left: position.x + 10
            });
        }

        this.close = function () {
            //remove all the listeners, when closing
            LineStream.removeAllListeners(padId + ':dragstart');
            LineStream.removeAllListeners(padId + ':dragend');
            LineStream.removeAllListeners(padId + ':drag');
            LineStream.removeAllListeners(padId + ':wipe');
        };
    };

    var Pad = function Pad(id) {
        var canvas = $('canvas');
        var ctx = canvas[0].getContext('2d');
        var drawing = false;
        var from;
        var skipCount = 0;
        var nickname;
        var color;

        setNickname(Session.get('person').name);

        //send padid to the sever
        LineStream.emit('pad', id);

        var pad = canvas.attr({
            width: $(window).width(),
            height: $(window).height()
        }).hammer();

        pad.on('dragstart', onDragStart);
        pad.on('dragend', onDragEnd);
        pad.on('drag', onDrag);

        function onDrag(event) {
            if (drawing) {
                var to = getPosition(event);
                drawLine(from, to, color);
                LineStream.emit(id + ':drag', nickname, to);
                from = to;
                skipCount = 0;
            }
        }

        function onDragStart(event) {
            drawing = true;
            from = getPosition(event);
            console.log(from);
            console.log(canvas);
            console.log(ctx.offsetLeft);
            console.log(ctx.offsetTop);

            from.x = from.x - ctx.offsetLeft;
            from.y = from.y - ctx.offsetTop;
            console.log("adjust");
            console.log(from);
            LineStream.emit(id + ':dragstart', nickname, from, color);
        }

        function onDragEnd() {
            drawing = false;
            LineStream.emit(id + ':dragend', nickname);
        }

        function getPosition(event) {
            return {x: parseInt(event.gesture.center.pageX), y: parseInt(event.gesture.center.pageY)};
        }

        function drawLine(from, to, color) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.closePath();
            ctx.stroke();
        }

        function setNickname(name) {
            nickname = name;
            //$('#show-nickname b').text(nickname);
            //localStorage.setItem('nickname', nickname);

            color = localStorage.getItem('color-' + nickname);
            if (!color) {
                color = getRandomColor();
                console.log(color);
                localStorage.setItem('color-' + nickname, color);
            }
        }

        function wipe(emitAlso) {
            ctx.fillRect(0, 0, canvas.width(), canvas.height());
            if (emitAlso) {
                LineStream.emit(id + ':wipe', nickname);
            }
        }

        ctx.strokeStyle = color;
        ctx.fillStyle = '#ffffff';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;

        ctx.fillRect(0, 0, canvas.width(), canvas.height());

        // Stop iOS from doing the bounce thing with the screen
        document.ontouchmove = function (event) {
            event.preventDefault();
        };

        //expose API
        this.drawLine = drawLine;
        this.wipe = wipe;
        this.setNickname = setNickname;
        this.close = function () {
            pad.off('dragstart', onDragStart);
            pad.off('dragend', onDragEnd);
            pad.off('drag', onDrag);
        };
    };


    var getRandomColor = function() {
        //var letters = '0123456789ABCDEF'.split('');
        //var color = '#';
        //for (var i = 0; i < 6; i++) {
        //    color += letters[Math.round(Math.random() * 15)];
        //}
        //return color;
        return '#000000'
    };
}