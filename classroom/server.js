const express = require("express");
const app  = express();
const users = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions =  {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : false
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res) => {
    let {name = "anonymous"} = req.query;
     req.session.name = name;
    //  console.log(req.session);
    req.flash("success","User registered successfully!")
    res.redirect("/hello");
});

app.get("/hello",(req,res) => {
    res.locals.message = req.flash("success");
    res.render("page.ejs",{name : req.session.name});
    
})

// app.get("/register",(req,res) => {
//     let {name = "anonymous"} = req.query;
//     res.send(name);
// });

// app.get("/reqcount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent request ${req.session.count} times`);
// })
// app.get("/test",(req,res) => {
//     res.send("test successfull");
// })

app.listen("3000",() => {
    console.log("server is listening to port 3000");
})




