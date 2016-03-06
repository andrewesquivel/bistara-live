/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Boards = new Mongo.Collection('boards');

boardSchema = new SimpleSchema({
    pages:{
        type:String
    }
});

Boards.attachSchema(boardSchema);
