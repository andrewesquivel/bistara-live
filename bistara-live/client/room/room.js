if (Meteor.isClient) {

  Template.room.rendered = function () {
    initSession();
  };

  var initSession = function () {
    if (!Session.get('person')){
      $(".overlay-container").show();
    }

    var pin = Router.current().params.pin;
    Session.set('pin', pin);

    // TODO: @drew make a method called "get-chatbox" that takes in the pin
    Session.set('chatbox', []);

    Meteor.call('get_room', pin, function (err, res) {
      if (err) console.log(err);
      else{
        Session.set('room', res);
        addOpenTok();
      }
    });
  };

  var addOpenTok = function(){
    var sessionId = Session.get('room').session;
    var token = Session.get('person').token;
    var apiKey = '45529562';
    console.log("sessionId: " + sessionId);
    console.log("token: " + token);
    var session = OT.initSession(apiKey, sessionId);
    var publisher = OT.initPublisher('publisherContainer');

    session.connect(token, function (err) {
      console.log("session connect");
      if(err) console.log(err);
      else{
        session.publish(publisher, function (error) {
          console.log("session publish");
          if (error) {
            console.log(error);
          } else {
            console.log('Publishing a stream.');
          }
        });
      }
    })

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
      console.log(res);
      $(".inbound-message-container").scrollTop($(".inbound-message-container")[0].scrollHeight + 50);
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
        console.log(Session.get('person'));
        $( ".overlay-container" ).animate({ opacity: 0}, 500, function()  { $(".overlay-container").hide(); });
      }
    })
  });

  Template.chat.helpers({
    inboundMessageList: function () {
      return Session.get('chatbox');
    }

  });

}
