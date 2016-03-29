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
      }
    });
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
          var publisher = OT.initPublisher('publisherContainer');
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

}
