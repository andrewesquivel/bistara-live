if (Meteor.isClient) {

  Template.room.rendered = function () {


    if (!Session.get('person')){
      $(".overlay-container").show();
    };

    var pin = Router.current().params.pin;
    Session.set('pin', pin);

    Meteor.call('get_chat', pin, function(err,res){
      if (err){
        throw err;
      }

      // Don't actually want the chatbox to be the chat object itself
      // but rather the comments (array of name-message tuples) to
      // simplify the HTML.
      var chat = res[0].comments;
      Session.set('chatbox', chat);
      
    })

    Meteor.call('get_room', pin, function (err, res) {
      if (err) console.log(err);
      else{
        Session.set('room', res);
      }
    });

  };

  Template.stream.rendered = function () {
    var sessionId = "";
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
      $(".inbound-message-container").scrollTop($(".inbound-message-container")[0].scrollHeight);
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
      }
    })
  });

  Template.chat.helpers({
    inboundMessageList: function () {
      var chat = Session.get('chatbox');
      return Session.get('chatbox');
    }

  });

}
