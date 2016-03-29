if (Meteor.isClient) {

  Template.room.rendered = function () {
    initSession();
  };

  var initSession = function () {
    $(".overlay-container").show();


    var pin = Router.current().params.pin;
    Session.set('pin', pin);

  };

    Meteor.setInterval(function(){
      var pin = Router.current().params.pin;
      Meteor.call('get_chat', pin, function(err,res) {
        if (err) {
          throw err;
        }

        // Don't actually want the chatbox to be the chat object itself
        // but rather the comments (array of name-message tuples) to
        // simplify the HTML.
        var newChat = res[0].comments;

        var existingChat = Session.get('chatBox');

        if (!existingChat){
          Session.set('chatbox', newChat);
        }

        else if (existingChat.slice(-1).pop() != newChat.slice(-1).pop()) {
          Session.set('chatbox', newChat);
        }
      })}, 1500);

  var addOpenTok = function(){
    var sessionId = Session.get('room').session;
    var token = Session.get('person').token;
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
  };




    //var session = OT.initSession(apiKey, sessionId);
    //console.log("init");
    //console.log(session);
    ////session.on('streamCreated', function(event) {
    ////  console.log("stream created");
    ////  console.log(session);
    ////      session.subscribe(event.stream);
    ////    });
    //session.connect(token, function(error) {
    //  if(error) console.log(error);
    //  console.log("connect");
    //  console.log(session);
    //      var publisher = OT.initPublisher('publisherContainer');
    //      session.publish(publisher);
    //    });

    //var session = OT.initSession(apiKey, sessionId);
    //session.on({
    //  streamCreated: function(event) {
    //    session.subscribe(event.stream, 'subscribersDiv', {insertMode: 'append'});
    //  }
    //});
    //session.connect(token, function(error) {
    //  if (error) {
    //    console.log(error.message);
    //  } else {
    //    session.publish('myPublisherDiv', {width: 320, height: 240});
    //  }
    //});

//    var session = TB.initSession(sessionId);
//
//// Initialize a Publisher, and place it into the element with id="publisher"
//    var publisher = TB.initPublisher(apiKey, 'publisher');
//
//// Attach event handlers
//    session.on({
//
//      // This function runs when session.connect() asynchronously completes
//      sessionConnected: function(event) {
//        // Publish the publisher we initialzed earlier (this will trigger 'streamCreated' on other
//        // clients)
//        session.publish(publisher);
//      },
//
//      // This function runs when another client publishes a stream (eg. session.publish())
//      streamCreated: function(event) {
//        // Create a container for a new Subscriber, assign it an id using the streamId, put it inside
//        // the element with id="subscribers"
//        var subContainer = document.createElement('div');
//        subContainer.id = 'stream-' + event.stream.streamId;
//        document.getElementById('subscribers').appendChild(subContainer);
//
//        // Subscribe to the stream that caused this event, put it inside the container we just made
//        session.subscribe(event.stream, subContainer);
//      }
//
//    });
//
//// Connect to the Session using the 'apiKey' of the application and a 'token' for permission
//    session.connect(apiKey, token);


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
        Session.set('person', res);
        $( ".overlay-container" ).animate({ opacity: 0}, 500, function()  { $(".overlay-container").hide(); });
        Meteor.call('get_room', pin, function (err, res) {
          if (err) console.log(err);
          else {
            Session.set('room', res);
            addOpenTok();
          }
        });
      }
    })
  });

  Template.chat.helpers({
    inboundMessageList: function () {
      return Session.get('chatbox');
    }

  });

}
