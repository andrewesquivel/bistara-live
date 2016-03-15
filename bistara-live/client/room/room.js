if (Meteor.isClient) {

  Template.room.rendered = function () {


    if (!Session.get('person')){
      $(".overlay-container").show();
      $(".")
    };

    var pin = Router.current().params.pin;
    Session.set('pin', pin);

    // TODO: @drew make a method called "get-chatbox" that takes in the pin
    Session.set('chatbox', []);

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
