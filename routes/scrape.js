//require the modules and files needed
const cheerio = require("cheerio");
const request = require("request");

// models required
const Note = require("..models/Note.js");
const Article = require("..models/Article.js");
const Save = require("..models/Save.js");

// export the function 

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        request("https://nytimes.com", function (err, response, html) {

            // load the HTML into cheerio and save it to a variable
            // $ will be the cheerio selector
            const $ = cheerio.load(html);

            const results = [];

            $("article.story").each(function (i, element) {
                const result = {};
                result.summary = $(element).children("p.summary").text();
                result.byline = $(element).children("p.byline").text();
                result.title = $(element).children("h2").text();
                result.link = $(element).children("h2").children("a").attr("href");

                if (result.title && result.link) {

                    Article.update({
                            link: result.link
                        },
                        result, {
                            upsert: true
                        },
                        function (error, doc) {
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                }
            });

            res.json({
                "code": "success"
            });

        });
    });

    // get all routes with the ID

    app.get("/articles/:id", function (req, res) {
        Article.find({
            "_id": req.params.id
        }).populate("note").exec(function (error, doc) {
            if (error) {
                console.log(error)
            } else {
                res.send(doc);
            }
        });
    });

    app.get("/saved/all", function (req, res) {
        Save.find({}).populate("note").exec(function (error, data) {
            if (error) {
                console.log(error)
            } else {
                res.json(data);
            }
        });
    });

    //post to save article

    app.post("/save", function (req, res) {
        const result = {};
        result.id = req.body._id;
        result.summary = req.body.summary;
        result.byline = req.body.byline;
        result.title = req.body.title;
        result.link = req.body.link;

        //save these results in an object that we can push into the results 
        const entry = new Save(result);
        // save the entry to the Data base

        entry.save(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        });
    });

    app.delete("/delete", function (req, res) {
        const result = {};
        result._id = req.body._id;
        Save.findOneAndRemove({
            '_id': req.body._id
        }, function (err, doc) {
            if (err) {
                console.log("error: ", err);
                res.json(err);
            } else {
                res.json(doc);
            }
        });
    });

    //get notes by id
    app.get("/notes/:id", function(req, res) {
        if(req.params.id) {
            Note.find({
                "article_id": req.params.id
            }).exec(function(error, doc) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(doc);
                }
            });
        }
    });
    // create a new Note
    app.post("/notes", function(req, res) {
        if(req.body) {
            const newNote = new Note(req.body);
            newNote.save(function(error, doc) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(doc);
                }
            });
            res.send("Error ");
        } 
    });

    // get the updated note

    app.get("/notepopulate", function(req, res) {
        Note.find({
            "_id": req.params.id
        }, function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });

    // delete the node 

    app.delete("/deletenote", function(req, res) {
        const results = {};
        result._id = req.body._id;
        Note.findOneAndRemove({
            '_id': req.body._id
        }, function(err, doc) {
            // console log the error
            if(err) {
                console.log("Error: ",err);
                res.json(err);
            } else {
                res.json(doc);
            }
        });
    });
};