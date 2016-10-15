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

// browse
app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// create
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// go to
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
})

// show
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

// create
app.post("/urls", (req, res) => {

  var shortURL = generateRandomString();
  var longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/" + shortURL);
})

// delete
app.post("/urls/:id/delete", (req, res) => {
 let templateVars = {shortURL: req.params.id};
 delete urlDatabase[templateVars.shortURL];
 res.redirect("/urls");
});

// // edit
// app.get("/urls/:id/edit", (req, res) => {
//   let templateVars = {shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
//   res.render("urls_show");
// })

app.post("/urls/:id", (req, res) => {
  var shortURL = req.params.id;
  // let templateVars = {shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  // longURL = urlDatabase[req.param.id];
  var newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls/"+shortURL);
})
// end of edit

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


