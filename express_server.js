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

var user = {};
// userDatabase
const users = {"123456": {id: "123456", email: "gaber@gaber.com", password: "testing"},
              "user2Random": {id: "user2Random", email: "yo@yo.com", password: "testing"}
              }

// Express middleware that parses cookies
app.use(cookieParser("super_secret_key"));


// home page
app.get("/", (req, res) => {
    res.render("_login");
});

// signup page
app.get("/signup", (req, res) => {
  res.render("signup");
})

// register post
app.post("/register", (req, res) => {
  // bcrypt.hash(req.body.password, 10, (err, hash) => {
  //   if (err) {
  //     res.send("There was an error creating your account")
  //     return;
  //   } 

  var email1 = req.body.email;
  var password1 = req.body.password;
  var idNum = generateRandomString();

  var user = {
    id: idNum, 
    email: email1, 
    password: password1
    }

    users[idNum] = user; 
      

  if (req.body.email === "") {
    console.log("Your email field is empty. Please put in a correct email.")
    res.redirect(400, "/login");
  } else if (req.body.password === "") {
    console.log("Your password field is empty. Please put in a real password.")
    res.redirect(400, "/login");
  // } else if (req.body.email === users[idNum].email) {
  //   console.log("This email already exists in the database. Please use a different email.")
  //   res.redirect(400, "/login")
  } else {
    res.cookie("userID", user.id);
    res.redirect("/");
  }

  });
// })

// login page
app.get("/login", (req,res) => {
  res.render("_login");
});


// login post 
app.post("/login", (req, res) => {
  
  let foundUser = false;
  for (user in users) {

    if (req.body.email === users[user].email && req.body.password === users[user].password) {
      foundUser = true;
      res.cookie("email", users[user].email)
      res.redirect("/urls");
    }
  } 
  // if (foundUser) {
  //   console.log("User does not exist. Please register.")
  //   res.redirect(401, "/login")
  // }

  // const user = data.users.find((user) => { return user.username === username});
  //check the password
  // bcrypt.compare(password, users.password, (err, matched) => {
    // if (users.password === password) {
    //   // set a cookie to keep track of user
    //   res.cookie("username", username);
    //   res.redirect("/urls")
    // } else {
    //   res.redirect("/login")
    // }
  // });
});

// logout
app.get("/logout", (req, res) => {
  res.clearCookie("email");
  res.clearCookie("userid");
  res.redirect("/login")
})

// logout post
app.post("/logout", (req, res) => {
  res.clearCookie("email");
  res.clearCookie("userid");
  res.redirect("/login");
});

// browse
app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase,
  email: req.cookies.email };
  res.render("urls_index", templateVars);
});

// create
app.get("/urls/new", (req, res) => {
  var templateVars = { urls: urlDatabase,
  email: req.cookies.email };
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
    email: req.cookies.email };
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
  email: req.cookies.email };
 delete urlDatabase[templateVars.shortURL];
 res.redirect("/urls", templateVars);
});

// edit
app.get("/urls/:id/edit", (req, res) => {
  let templateVars = {shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show");
})

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
    var text = "";
    var len = 6;
    
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}


