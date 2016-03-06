/**
 * Created by Andrew Esquivel on 3/6/16.
 */
Pages = new Mongo.Collection('pages');

pageSchema = new SimpleSchema({
    background: {
        type: String
    },
    drawing:{
        type: String
    }
});

Pages.attachSchema(pageSchema);