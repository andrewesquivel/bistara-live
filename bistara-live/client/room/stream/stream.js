/**
 * Created by abe707 on 4/15/16.
 */
if(Meteor.isClient){
    addOpenTok = function(){
        var sessionId = Session.get('room').session;
        var name = Session.get('person').name;
        Meteor.call('get_token', sessionId, name, function (err, token) {
            var apiKey = '45562692';

            var session = OT.initSession(apiKey, sessionId);

            session.on({
                streamCreated: function(event) {
                    //the following is the css applied to the incoming streams
                    var options= {
                        insertMode: 'append',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '40vh',
                    };
                    session.subscribe(event.stream, 'subscriberContainer', options);
                }
            });

            session.connect(token, function (err) {
                if(err) console.log(err);
                else{
                    //The following options designate the CSS applied to the main publishing video
                    var options = {
                        insertMode: 'append',
                        width: '0%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '0%',
                    };
                    var publisher = OT.initPublisher('publisherContainer',options);
                    session.publish(publisher, function (error) {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            });
        });
    };
}