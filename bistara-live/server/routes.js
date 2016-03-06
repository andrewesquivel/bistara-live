/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Meteor.methods({
    example_method: function(){
        return "example";
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
     * @param peoplIds - array of strings
     * @returns an array of people objects that match peopleIds
     * @throws err if could not find people
     */
    get_people: function(peoplIds){
        var people = People.find({_id:peoplIds}).fetch();
        if(people) return people;
        else throw {err: "could not find people"};
    }

});

