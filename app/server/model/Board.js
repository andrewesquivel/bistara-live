/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Boards = new Mongo.Collection('boards');

boardSchema = new SimpleSchema({
    state:{
        type:String,
        defaultValue:''
    },
    pin:{
        type:String
    }

});

Boards.attachSchema(boardSchema);

createBoard = function(pin){
    var doc = {state:"", pin:pin};
    var boardId = Boards.insert(doc);
    return boardId;
};

getBoardState = function(pin){
    var board = Boards.findOne({pin:pin});
    if(board.state) return board.state;
    else throw {err:'board state unavailable'};
};

setBoardState = function(pin, state){
    var board = Boards.findOne({pin:pin});
    var result = Boards.update(board._id, {$set: {state:state}});
    if(!result) throw {err:"could not update"};
};