const express = require("express");
const router  = express.Router();

//Index - Route
router.get("/users",(req,res) => {
    res.send("GET for users");
});
//Show Route
router.get("/users/:id",(req,res) => {
    res.send("GET for user id");
});
//Post Route
router.post("/users",(req,res) => {
    res.send("POST for users");
});
//Delete Route
router.delete("/users/:id",(req,res) => {
    res.send("DELETE for user id");
});

module.exports = router;