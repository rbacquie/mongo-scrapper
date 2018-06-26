// all requires and associated variables 
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const Note = require("./models/Note.js");
const Article = require("./models/Articles.js");
const Save = require("./models/Save.js");
const logger = require("morgan");
const cheerio = require("cheerio");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

//Parse applicatiom

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("./public"));

//connect to the database
mongoose.Promise = Promise;
const dbConnect = process.env.MONGODB_URI || "mongod://localhost/foxScrape";

// checks to see if connected to external Database if no then it will connect to local host
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(dbConnect)
};

const db = mongoose.connection;
db.on('error', function(err) {
    console.log('Mogoose Error', err);
});

db.once('open', function() {
    console.log("Mongoose connection successful");
});

const exphs = require("express-handlebars");

app.engine('handlebars', exphs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.sendfile(path.join(__dirname, "view/index.html"));
});

require("./routes/scrape.js")(app);
require("./routes/html.js")(app);

app.get("*", function(req, res) {
    res.sendfile(path.join(__dirname, "views/index.html"));
});

app.listen(PORT, function() {
    console.log("App Listening to PORT " + PORT);
});