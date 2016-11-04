const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// urlDatabase
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// userDatabase
var user = {};
const users = { "123456": {id: "123456", email: "gaber@gaber.com", password: "$2a$10$HFzoVvscyDuOBhRz3n2lfeWyvfUzbBzLxCA41pL/TqpD/r0RZokoy"},
              "user2Random": {id: "user2Random", email: "yo@yo.com", password: "$2a$10$HFzoVvscyDuOBhRz3n2lfeWyvfUzbBzLxCA41pL/TqpD/r0RZokoy"}
              }

// // Express middleware that parses cookies
app.use(cookieParser("super_secret_key"));

const saltRounds = 10;
const myPassword = 'testing';
const otherPassword = 'nothere';


bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash(myPassword, salt, function(err, hash) {
    // console.log(hash)
  })
});

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))



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

  var email1 = req.body.email;
  var password1 = req.body.password;
  var hashed_password = bcrypt.hashSync(password1, 10);
  var idNum = generateRandomString();

  
      
  if (req.body.email === "") {
    console.log("Your email field is empty. Please put in a correct email.")
    res.redirect(400, "/register");
  } else if (req.body.password === "") {
    console.log("Your password field is empty. Please put in a real password.")
    res.redirect(400, "/register");
  // } else if (req.body.email === users[idNum].email) {
  //   console.log("This email already exists in the database. Please use a different email.")
  //   res.redirect(400, "/login")
  } else {
    var user = {
    id: idNum, 
    email: email1, 
    password: hashed_password
    }

    users[idNum] = user; 
    req.session.users_ID = "userID"
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
  // const password_hash = bcrypt.compareSync(req.body.password, users[user].password);
  // console.log(users)
  for (userId in users) {
    if (req.body.email === users[userId].email && bcrypt.compareSync(req.body.password, users[userId].password)) {
      req.session.email = users[userId].email
      // console.log(req.session.email)
      return res.redirect("/urls");
    } 
  } 
  res.redirect(401, "/login")

});




// logout
// app.get("/logout", (req, res) => {
//   res.clearCookie("email");
//   res.clearCookie("userid");
//   res.redirect("/login")
// })




// logout post
app.post("/logout", (req, res) => {
  // res.clearCookie("email");
  // res.clearCookie("userid");
  req.session = null;
  res.redirect("/login");
});



// browse
app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase,
                      email: req.session.email };
  res.render("urls_index", templateVars);
});



// create get
app.get("/urls/new", (req, res) => {
  var templateVars = { urls: urlDatabase,
  email: req.session.email };
  if (req.session.email) {
  res.render("urls_new", templateVars);
  } else {
    res.redirect(401, "/login")
  }
});

// create post
app.post("/urls", (req, res) => {

  var shortURL = generateRandomString();
  var longURL = req.body.longURL;

  urlDatabase[shortURL] = {url: longURL, email: req.session.email};
  console.log(urlDatabase)

  // users[user].shortURL = longURL
  res.redirect("/urls/" + shortURL);
})


// go to
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
})



// show
app.get("/urls/:id", (req, res) => {
  
  let templateVars = { shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id],
    email: req.session.email };
  res.render("urls_show", templateVars);
});







// delete
app.post("/urls/:id/delete", (req, res) => {
 let templateVars = {shortURL: req.params.id};
 delete urlDatabase[templateVars.shortURL];
 res.redirect("/urls");
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
  console.log(`Tiny app listening on port ${PORT}!`);
});

function generateRandomString() {
    var text = "";
    var len = 6;
    
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}


