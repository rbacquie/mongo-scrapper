// require the mongoose package
const mongoose = require("mongoose");
// create schema form
const Schema = mongoose.Schema;

// create the schema

const SaveSchema = new Schema({
    // title is made rquired strinf
    title: {
        type: String,
        required: true,
    },
    // link is made required
    link: {
        type: String,
        required: true
    },
    // summary is a string but not required
    summary: {
        type: String
    },
    //byline is a string and not required
    byline: {
        type: String
    },
    // note object 
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create the Save model with the SaveSchema
const Save = mongoose.model("Save", SaveSchema);

// Export the model
module.exports = Save;