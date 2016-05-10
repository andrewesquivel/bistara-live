/**
 * Created by abe707 on 4/15/16.
 */
if(Meteor.isClient){
    Template.chat.rendered = function(){
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
    };

    Template.chat.helpers({
        inboundMessageList: function () {
            return Session.get('chatbox');
        }

    });


    //***************************************************************************************
    //****************************** Button Functionality ***********************************
    //***************************************************************************************

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

}