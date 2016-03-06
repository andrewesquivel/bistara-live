/**
 * Created by Andrew Esquivel on 3/6/16.
 */
var testCreateRoom = function(){
    console.log("\n\n ***** Test Create Room *****");
    var resultCreate = createRoom();
    if(resultCreate.err) console.log(resultCreate.err);
    else{
        var pin = resultCreate.PIN;
        console.log("created room with pin: " + pin);
        var room = Rooms.findOne({PIN:pin});
        console.log(room);
    }
};

var testAddFirstName = function(){
    console.log("\n\n ***** Test Add First Name *****");
    var resultCreate = createRoom();
    if(resultCreate.err) console.log(resultCreate.err);
    else{
        var pin = resultCreate.PIN;
        var room = Rooms.findOne({PIN:pin});

        var name1 = "name1";
        var resultJoin1 = joinRoom(name1, pin);
        if(resultJoin1.err) console.log("first name: " + resultJoin1.err);
        else {
            console.log("joined room " + pin + " with name " + name1);
            room = Rooms.findOne({PIN: pin});
            console.log(room);
        }
    }
};

var testAddNewName = function(){
    console.log("\n\n ***** Test Add New Name *****");
    var resultCreate = createRoom();
    if(resultCreate.err) console.log(resultCreate.err);
    else{
        var pin = resultCreate.PIN;
        var room = Rooms.findOne({PIN:pin});

        var name1 = "name1";
        var name2 = "name2";
        var resultJoin1 = joinRoom(name1, pin);
        if(resultJoin1.err) console.log("first name: " + resultJoin1.err);
        else{
            room = Rooms.findOne({PIN:pin});
            var resultJoin2 = joinRoom(name2, pin);
            if(resultJoin2.err) console.log("second name: " + resultJoin2.err);
            else{
                console.log("joined room " + pin + "with name " + name2);
                room = Rooms.findOne({PIN: pin});
                console.log(room);
            }
        }
    }
};

var testAddSameName = function(){
    console.log("\n\n ***** Test Add Same Name *****");
    var resultCreate = createRoom();
    if(resultCreate.err) console.log(resultCreate.err);
    else{
        var pin = resultCreate.PIN;
        var room = Rooms.findOne({PIN:pin});

        var name1 = "name1";
        var resultJoin1 = joinRoom(name1, pin);
        if(resultJoin1.err) console.log("first name: " + resultJoin1.err);
        else{
            room = Rooms.findOne({PIN:pin});
            var resultJoin2 = joinRoom(name1, pin);
            console.log("add same name: " + resultJoin2);
            room = Rooms.findOne({PIN: pin});
            console.log(room);
        }
    }
};


if(test){
    testCreateRoom();
    testAddFirstName();
    testAddNewName();
    testAddSameName();
}
