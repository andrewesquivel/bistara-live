/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Meteor.methods({
    example_method: function(){
        return "example";
    },

    create_room: function () {
        var pin = createRoom();
        console.log(pin);
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
        else return true;
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
    }

});

