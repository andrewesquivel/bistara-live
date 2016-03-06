/**
 * Created by Andrew Esquivel on 3/6/16.
 */

People = new Mongo.Collection('people');

personSchema = new SimpleSchema({
    name:{
        type:String
    },
    stream:{
        type:String
    },
    color:{
        type:[Number],
        minCount:3,
        maxCount:3
    }
});

People.attachSchema(personSchema);
