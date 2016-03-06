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
        type:[String],
        max:10
    },
    board:{
        type:String
    },
    chat:{
        type:String
    }
});

Rooms.attachSchema(roomSchema);