var path = require("path");

// this function handles the routes for each call fron the client end
module.exports = function(app) {

    app.get("/", function (req, res) {
        res.sendfile(path.join(__dirname, "view/index.html"));
    });

    app.get("/saved/all", function (req, res) {
        res.sendfile(path.join(__dirname, "views/saved.html"));
    });

    app.get("*", function (req, res) {
        res.sendfile(path.join(__dirname, "views/index.html"));
    });
};