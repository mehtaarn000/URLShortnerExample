//modules
const express = require('express');
const fs = require("fs")
const app = express();
const bodyParser = require('body-parser');

//Render html
const html = fs.readFileSync("html/home.html").toString("utf8")

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

app.use(bodyParser());
app.use(express.static(__dirname + '/html'));

//Main route
app.get("/", function(req, res){
    res.send(html);
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
    const response = `{"${parseJson[randomID]}": "${randomID}"}\n`
    res.send(response)
});

app.listen(3000);