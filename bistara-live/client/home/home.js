if (Meteor.isClient) {

  Template.home.rendered = function(){
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