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
     * @param pin - string
     *
     * throws error if room is full, pin is invalid, name is taken
     */
    join_room: function(name, pin) {
        return false;
    },

    check_room: function (pin) {
        var room = Rooms.findOne({PIN:pin});
        if(room) return true;
        return false;
    }

});

