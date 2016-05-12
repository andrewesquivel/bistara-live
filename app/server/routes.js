/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Meteor.methods({
    example_method: function(){
        return "example";
    },

    create_room: function () {
        console.log("creating room");
        var pin = createRoom();
        console.log("room created: " +pin);
        return pin;
    },

    /**
     *
     * @param name - string
     * @param pin - string length 4
     * @throw error pin is invalid or name is taken
     * @return true if successfuly joined room
     */
    join_room: function(name, pin) {
        var result = joinRoom(name, pin);
        if(result.err) throw result.err;
        else{
            var personId = result.id;
            return People.findOne({_id:personId});
        }
    },

    /**
     *
     * @param pin - String length 4
     * @returns true if a room with that pin exists
     */
    check_room: function (pin) {
        var room = Rooms.findOne({PIN:pin});
        if(room) return true;
        return false;
    },


    /**
     *
     * @param pin - String length 4
     * @returns the room object if there is a room that matches that pin
     * @throws err if there is no room with that pin
     */
    get_room: function(pin){
        var room = Rooms.findOne({PIN:pin});
        if(room) return room;
        else throw {err: "could not find room"};
    },

    /**
     *
     * @param pin - String length 4
     * @returns an array of people objects that match peopleIds
     * @throws err if could not find people
     */
    get_people: function(pin){
        var room = Rooms.findOne({PIN:pin});
        if(room){
            var people = People.find({_id:room.people}).fetch();
            if(people) return people;
            else throw {err: "could not find people"};
        } else throw {err: "could not find room"};
    },

    /**
     *
     * @param pin
     * @returns the chat asociated with the room that the pin corresponds to
     */
    get_chat: function(pin){
        var room = Rooms.findOne({PIN:pin});
        if(room){
            var chat = Chats.find({_id:room.chat}).fetch();
            if(chat) return chat;
            else throw {err: "could not find chat"};
        } else throw {err: "could not find room"};
    },

    /**
     *
     * @param pin
     * @param name
     * @param text
     * @return the updated chat
     */
    add_comment: function(pin, name, text){
        var room = Rooms.findOne({PIN:pin});
        if(room){
            return addCommentToChat(room.chat,name,text);
        } else throw {err: "could not find room"};
    },

    get_token: function(sessionId, name){
        return createToken(sessionId, name);
    },



    get_board_state: function (pin) {
        return getBoardState(pin);
    },

    set_board_state: function(pin, state){
        setBoardState(pin, state);
    }
});

var options = {
    url: 'create',
    getArgsFromRequest: function(request){
        console.log("------------GET ARGS FROM REQUST------------");
        console.log(request);
       return [];
    }
};

Meteor.method("create", function(callback){
    return createRoom();
}, options);

//JsonRoutes.ErrorMiddleware.use(RestMiddleware.handleErrorAsJson);
JsonRoutes.setResponseHeaders({
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
});
