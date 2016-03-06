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
        type:String,
        defaultValue:''
    },
    chat:{
        type:String,
        defaultValue:''
    }
});

Rooms.attachSchema(roomSchema);


createRoom  = function () {
    var pin = generatePIN();
    console.log(pin);
    while(Rooms.find({PIN:pin}).fetch().length > 0)
        pin = generatePIN();
    if(debug) console.log("created pin: " + pin);
    var chatId = createChat();
    if(debug) console.log("chat: " + chatId);
    var doc = {PIN:pin, people:[], board:"", chat:chatId};  //TODO board and chat
    if(debug) console.log(doc);
    var roomId = Rooms.insert(doc);
    if(debug) console.log("roomId : " + roomId);
    if(roomId) return {PIN:pin};
    else return {err:'failed to insert room'};
};

var generatePIN = function () {
    return Math.random().toString(36).substring(2,6);
};

/**
 * checks if name is already beings used in room
 * if it is return err
 * else adds person to room
 *
 * @param name - string
 * @param pin - string length 4
 * @returns {err: 'message'} if pin is invalid, name is taken, or fails to create person/ add them to the room
 */
joinRoom = function (name, pin) {
    var room = Rooms.findOne({PIN:pin});
    if(room){
        if(isNameTaken(room.people, name)) return {err:'name taken'};
        else{
            return addPersonToRoom(name, room._id);
        }
    }else return {err:'invalid pin'};
};

/**
 * adds person to room
 * @param name
 * @param roomId
 * @returns  error if fails to create or add person, otherwise returns empty object
 *
 */
var addPersonToRoom = function(name,roomId){
    var doc  = {name: name, stream:"", color:[0,0,0]};
    var personID = People.insert(doc);
    if(personID){
        var result = Rooms.update(roomId, {$push:{people:personID}});
        if(result) return {}; //TODO there should be a better way so signal success
        else return {err:'failed to add person to room'};
    }else return {err:'failed t0 create person'};
};

/**
 *
 * @param peopleIds
 * @param name
 * @returns true if one of the people already has that name, false otherwise
 */
var isNameTaken = function(peopleIds, name){
    var people = People.find({_id:peopleIds}).fetch();
    var nameTaken = false;
    people.forEach(function(person){
        if(person.name === name) nameTaken = true;
    });
    return nameTaken
};


