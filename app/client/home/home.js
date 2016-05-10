if (Meteor.isClient) {

  //Secret Knock Solution for creating a room
  window.addEventListener('click', function (evt) {
    if (evt.detail === 3) {
      console.log("read tripple click");
      Meteor.call("create_room",function(err, result){
        if (result){
          $('.front-door .pin').val(result.PIN);
        }
      });
    }
  });

  Template.home.rendered = function(){
    Session.clearPersistent()
    //Meteor.call('create_room', function(err, result){});
  };
  // Regex check that the string contains characters
  function validPin(pin){
    return /\S/.test(pin)
  };

  // On clicking of the Join Room button
  $(document).on('click', '.enter', function (e) {
    e.preventDefault();

    // Get the pin
    var pin = $('.front-door > .pin')[0].value;

    // If the pin is not valid
    if (!validPin(pin)){
      // Alert the user and break
      alert ("Invalid pin value.");
      return;
    }

    // See if a room exists matching this pin
    Meteor.call('check_room', pin, function(err, res){
      if (err){
        throw err;
      }
      // If it does, route us to that room
      if (res){
        Router.go('/room/' + pin)
      }
      // If not, alert the user
      else {
        alert("Room with pin '" + pin + "' does not exist. Please try again.");
      }
    })

  });

}