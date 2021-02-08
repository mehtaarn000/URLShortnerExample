//modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs")
const path = require("path")

//To generate random urls
function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//App config
const app = express();
app.use(bodyParser());
app.set("view options", {layout: false})
app.use(express.static(__dirname + "/views"))

//Main route
app.get("/", function(req, res){
    res.render("/views/index.html");
})

//For form
app.post("/", function(req, res){
    const url = req.body.givenurl
    const jsonContent = fs.readFileSync("db.json")
    const parseJson = JSON.parse(jsonContent)
    const randomID = makeid(7)
    parseJson[randomID] = url
    const JSONDATA = JSON.stringify(parseJson)
    fs.writeFileSync("db.json", JSONDATA)
    const newurl = "localhost:3000/" + randomID
    res.send(newurl)
})

//For each url
app.get("/:id", function(req, res){
    const database = fs.readFileSync("db.json")
    const dbparse = JSON.parse(database)

    const urlid = dbparse[req.params.id]
    if (urlid !== undefined){
        res.status(200).redirect(urlid)
    }
    else{
        res.status(404).send("sorry that url is invalid")
    }
})

//To use the REST api
//POST data should be a JSON string such as this: '{"url": "https://example.com"}'
app.post('/api/urlshorten', function(req, res){
    const postJsonData = req.body
    const url = postJsonData["url"]
    if (url === undefined){
        res.send('{"message": "invalid JSON data"}')
        return
    }
    const jsonContent = fs.readFileSync("db.json")
    const parseJson = JSON.parse(jsonContent)
    const randomID = makeid(7)
    parseJson[randomID] = postJsonData["url"]
    const JSONDATA = JSON.stringify(parseJson)
    fs.writeFileSync("db.json", JSONDATA)
    const response = `{"${randomID}": "${parseJson[randomID]}"}`
    res.send(response)
});

app.listen(3000);