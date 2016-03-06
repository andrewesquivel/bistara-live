/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Rooms = new Mongo.Collection('rooms');

roomSchema = new SimpleSchema({
    PIN:{
        type:String,
        max:4,
        min:4
    },
    people:{
        type:[String]
    },
    board:{
        type:String
    },
    chat:{
        type:String
    }
});

Rooms.attachSchema(roomSchema);

joinRoom = function (name, pin) {
    var room = Rooms.findOne({PIN:pin});
    if(room){
        if(nameIsTaken(room.people, name)) return {err:'name taken'};
        else{
            var doc  = {name: name, stream:"", color:[0,0,0]};
            var personID = People.insert(doc);
            if(personID){
                var result = Rooms.update(room._id, {$push:{people:personID}});
                if(result) return {};
                else return {err:'failed to add person to room'};
            }else return {err:'failed t0 create person'};
        }

    }else return {err:'invalid pin'};
};

var nameIsTaken = function(peopleIds, name){
    var people = People.find({_id:peopleIds}).fetch();
    var nameTaken = false;
    people.forEach(function(person){
        if(person.name === name) nameTaken = true;
    });
    return nameTaken
}
