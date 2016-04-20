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

  var getRoom = function(){
    Meteor.call('get_room', Session.get('pin'), function (err, res) {
      if (err) console.log(err);
      else {
        Session.set('room', res);
        addOpenTok(); // global method from stream.js
        addBoard(); // global method from board.js
      }
    });
  };

  //***************************************************************************************
  //****************************** Button Functionality ***********************************
  //***************************************************************************************



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
  });

  $(document).on('click', '#erase-board-button', function (e) {
    console.log("User is trying to erase the board");
    var myCanvas = document.getElementById("main-whiteboard");
    var ctx = myCanvas.getContext("2d");

    // Set Background Color
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
  });

}
