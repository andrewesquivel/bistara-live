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
        minCount:3,
        maxCount:3,
        defaultValue:[0,0,0]
    }
});

chatSchema = new SimpleSchema({
    comments:{
        type: [commentSchema],
        defaultValue:[]
    }
});


Chats.attachSchema(chatSchema);


createChat = function () {
    var chatId =  Chats.insert({comments:[]});
    if(chatId) return chatId;
    throw {err: 'failed to create chat'};
};

addCommentToChat = function(chatId, name, text){
    var comment = {name:name, text:text, color:[0,0,0]};
    var result = Chats.update(chatId, {$push:{comments: comment}});
    if(!result) throw {err: "failed to add comment to chat"};
    return Chats.findOne({_id:chatId});
};