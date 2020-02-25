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

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, database) {
    assert.equal(null, err);
    console.log("Connection server réussie");
    const db = database.db("OnlineSales");

    //Gestion de la route qui filtre les produits suivant 5 paramètres
    app.get("/Products/:type/:brand/:minprice/:maxprice/:minpopularity", function(req, res) {
        let filterObject = {};
        
        if (req.params.type != "*") {
            filterObject.type != req.params.type;
        }
        if (req.params.brand != "*") {
            filterObject.brand != req.params.brand;
        }
        if (req.params.minprice != "*" || req.params.maxprice != "*" ) {
            filterObject.price = {};
            if (req.params.minprice != "*")
                filterObject.price.$gte = parseInt(req.params.minprice);
            if (req.params.maxprice != "*")
                filterObject.price.$lte = parseInt(req.params.maxprice);
        }
        if (req.params.minpopularity != "*") {
            filterObject.popularity = {$gte: parseInt(req.params.minpopularity)};
        }

        productResearch(db, {"message":"/Products", "filterObject": filterObject}, function(step, results) {
            console.log(step+" avec "+results.length+" produits sélectionnés");
            res.setHeader("Content-type", "application/json; charset=UTF-8");
            let json = JSON.stringify(results);
            res.end(json);
        });
    });

    //Gestion de la route qui renvoie un document via son identifiant interne
    app.get("/Product/id=:id", function(req, res) {
        let id = req.params.id;
        console.log("Dans /Product/id="+id);
        if (/[0-9a-f] {24}/.test(id)) {
            db.collection("Products").find({"_id": ObjectId(id)}).toArray(function(err, documents) {
                let json = JSON.stringify({});
                if (documents !== undefined && documents[0] !== undefined) {
                    json = JSON.stringify(documents[0]);
                }
                res.end(json);
            });
        }
        else res.end(JSON.stringify({}));
    });
});
