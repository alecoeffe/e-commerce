let express = require("express");
let cors = require("cors");
let app = express();
let assert = require("assert");

app.listen(8888);
app.use(cors());

let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
let url = "mongodb://localhost:27017/OnlineSales";

function productResearch (db, param, callback) {
    db.collection("Products").find(param["filterObject"]).toArray(function(err, documents) {
        if (documents !== undefined)
            callback(param["message"], documents);
        else
            callback(param["message"], []);
    });
}

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    //Gestion de la route qui filtre les produits suivant 5 paramètres
    app.get("/Products/criteria/:type/:brand/:minprice/:maxprice/:minpopularity", function(req, res) {

    });
});
