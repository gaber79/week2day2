const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( {
	extended: true
}));

var urlDatabase = {
	"b2xVn2": "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
	res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
	res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
	var templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
	let longURL = urlDatabase[req.params.shortURL]
	res.redirect(longURL);
})

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.redirect("urls_show", templateVars);
});

app.post("urls/:id/delete", (req, res) => {
	delete urlDatabase.shortURL;
	res.redirect("/urls");
})


app.post("/urls", (req, res) => {

	var shortURL = generateRandomString();
	var longURL = req.body.longURL;

	urlDatabase[shortURL] = longURL;
	res.redirect("/urls/" + shortURL);
})

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
	  var text = " ";
	  var len = 6;
    
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}


