/**
 * Created by Andrew Esquivel on 3/6/16.
 */

Chats = new Mongo.Collection('chats');

commentSchema = new SimpleSchema({
    name:{
        type: String
    },
    text:{
        type: String
    },
    color:{
        type:[Number],
        min:3,
        max:3
    }
});

chatSchema = new SimpleSchema({
    comments:{
        type: [commentSchema]
    }
});


Chats.attachSchema(chatSchema);
