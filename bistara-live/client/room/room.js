if (Meteor.isClient) {

  Template.room.rendered = function () {
    Session.set('chatbox',[]);

    var pin = Router.current().params.pin;
    Session.set('pin',pin);

  };

  $(document).on('click', '.send-message-button', function (e) {
    var message = $('.outbound-message')[0].value;
    var pin = Session.get('pin');
    var name = Session.get('name');
    Meteor.call('add_comment', pin, name, message, function(err,res){
      if (err){
        throw err;
      }
      console.log(res);
      Session.set('chatbox', res.comments);
    })
  });

  $(document).on('click', '.nametag-form .submit', function (e) {
    var name = $('.nametag-form .name')[0].value;
    var pin = Session.get('pin');
    Meteor.call('join_room', name, pin, function(err,res){
      if (err){
        throw err;
      }
      if (res){

      }
    })
  });

  Template.chat.helpers({
    inboundMessageList: function () {
      return Session.get('chatbox');
    }

  });



}
