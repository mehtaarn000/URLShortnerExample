//Required packages
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs")

//To generate random url ids
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

//Main route for form
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

//For redirects
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
//'https' is required as scheme
app.post('/api/urlshorten', function(req, res){
    const url = req.body.url
    if (url === undefined){
        res.json({message: "invalid JSON data"})
        return
    }

    if (!url.includes("https://")) {
        res.json({message: "url must have 'https' as scheme"})
        return
    }

    const jsonContent = fs.readFileSync("db.json")
    const parseJson = JSON.parse(jsonContent)
    const randomID = makeid(7)
    parseJson[randomID] = url
    const JSONDATA = JSON.stringify(parseJson)
    fs.writeFileSync("db.json", JSONDATA)
    const response = `{"${randomID}": "${parseJson[randomID]}"}`
    res.send(response)
});

app.listen(3000);