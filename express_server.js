const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( {
  extended: true
}));

// urlDatabse
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// userDatabase
const data = {
  users: [
  {
    username: "gaber", password: "testing"
  }]
};

// Express middleware that parses cookies
app.use(cookieParser("super_secret_key"));

// home page
app.get("/", (req, res) => {
  // if user logged in show treasure,
  // else show login
  let templateVars = {
  username: req.cookies["username"]
  // ... any other vars
};
  const current_user = req.signedCookies.current_user
  console.log(current_user);
  console.log(username);
  if (current_user) {
    res.redirect("/urls", templateVars);
  } else {
    res.render("_login");
  }
});

// signup page
app.get("/signup", (req, res) => {
  res.render("signup");
})

// signup post
app.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.send("There was an error creating your account")
      return;
    }
    data.users.push({username: req.body.username, password: req.body.hash});
    // console.log("All users are: ", data.users)
    res.redirect("/");
  });
})

// login page
app.get("/login", (req,res) => {
  res.render("_login");
});


// login post 
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // find user by username
  const user = data.users.find((user) => { return user.username === username});
  //check the password
  bcrypt.compare(password, user.password, (err, matched) => {
    if (user.password === password) {
      // set a cookie to keep track of user
      res.cookie("username", username);
      res.redirect("/urls")
    } else {
      res.redirect("/login")
    }
  });
});

// logout
app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/login")
})

// logout post
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
});

// browse
app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase,
  username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

// create
app.get("/urls/new", (req, res) => {
  var templateVars = { urls: urlDatabase,
  username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// go to
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
})

// show
app.get("/urls/:id", (req, res) => {
  
  let templateVars = { shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] };
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
 let templateVars = {shortURL: req.params.id,
  username: req.cookies["username"]};
 delete urlDatabase[templateVars.shortURL];
 res.redirect("/urls", templateVars);
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


