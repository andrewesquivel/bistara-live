if (Meteor.isClient) {

  Template.room.rendered = function () {
    var pin = Router.current().params.pin;
    Session.set('pin', pin);




    if(!Session.get('person')){
      $(".overlay-container").show();
    }else{
      getRoom();
    }

  };

    //Meteor.setInterval(function(){
    //  var pin = Router.current().params.pin;
    //  Meteor.call('get_chat', pin, function(err,res) {
    //    if (err) {
    //      throw err;
    //    }
    //
    //    // Don't actually want the chatbox to be the chat object itself
    //    // but rather the comments (array of name-message tuples) to
    //    // simplify the HTML.
    //    var newChat = res[0].comments;
    //
    //    var existingChat = Session.get('chatBox');
    //
    //    if (!existingChat){
    //      Session.set('chatbox', newChat);
    //    }
    //
    //    else if (existingChat.slice(-1).pop() != newChat.slice(-1).pop()) {
    //      Session.set('chatbox', newChat);
    //    }
    //  })}, 1500);


  var getRoom = function(){
    console.log('getRoom');
    Meteor.call('get_room', Session.get('pin'), function (err, res) {
      if (err) console.log(err);
      else {
        Session.set('room', res);
        addOpenTok();
        addBoard();
      }
    });
  };


  var addBoard = function(){
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
            });
      }
      // Disable Page Move
      document.body.addEventListener('touchmove',function(evt){
        evt.preventDefault();
      },false);
  };

  var addOpenTok = function(){
    var sessionId = Session.get('room').session;
    var name = Session.get('person').name;
    Meteor.call('get_token', sessionId, name, function (err, token) {
      var apiKey = '45529562';
      console.log("sessionId: " + sessionId);
      console.log("token: " + token);

      var session = OT.initSession(apiKey, sessionId);
      console.log(session);

      session.on({
        streamCreated: function(event) {
          session.subscribe(event.stream, 'subscriberContainer', {insertMode: 'append'});
        }
      });
      session.connect(token, function (err) {
        console.log("session connect");
        if(err) console.log(err);
        else{
          // The following options designate the CSS applied to the main publishing video
          var publisherOptions = {
            insertMode: 'append',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '40vh',
          };
          var publisher = OT.initPublisher('publisherContainer',publisherOptions);
          session.publish(publisher, function (error) {
            console.log("session publish");
            if (error) {
              console.log(error);
            } else {
              console.log('Publishing a stream.');
            }
          });
        }
      });
    });
  };


  $(document).on('click', '.send-message-button', function (e) {
    var message = $('.outbound-message')[0].value;
    var pin = Session.get('pin');
    var name = Session.get('person').name;
    Meteor.call('add_comment', pin, name, message, function(err,res){
      if (err){
        $('.outbound-message')[0].value("");
        throw err;
      }
      $(".inbound-message-container").scrollTop($(".inbound-message-container")[0].scrollHeight + $(".inbound-message").height());
      $('.outbound-message').val('')
      Session.set('chatbox', res.comments);

    })
  });

  $(document).on('click', '.nametag-form .submit', function (e) {
    $( ".overlay-container" ).animate({ opacity: 0}, 500, function()  { $(".overlay-container").hide(); });

    var name = $('.nametag-form .name')[0].value;
    var pin = Session.get('pin');
    Meteor.call('join_room', name, pin, function(err,res){
      if (err){
        throw err;
      }
      if (res) {
        Session.setPersistent('person', res);
        $( ".overlay-container" ).animate({ opacity: 0}, 500, function()  { $(".overlay-container").hide(); });
        getRoom();
      }
    })
  });

  Template.chat.helpers({
    inboundMessageList: function () {
      return Session.get('chatbox');
    }

  });

  //***************************************************************************************
  //******************************Toolbar Functionality ***********************************
  //***************************************************************************************

  var toolbarHidden = true;
  $(document).on('click',".main-toolbar>.tab",function(e){
    console.log("trying to hide the toolbar");
    var newRightLocation = -1 * $(".main-toolbar").width();
    if (toolbarHidden){
      newRightLocation = '0';
    }
    $('.main-toolbar').animate({right: newRightLocation},500,function(){
      toolbarHidden = !toolbarHidden;
    })
  })

  $(document).on('click', '#erase-board-button', function (e) {
    console.log("User is trying to erase the board");
    var myCanvas = document.getElementById("main-whiteboard");
    var ctx = myCanvas.getContext("2d");

    // Set Background Color
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
  });

}
