const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
     email : {
        type : String,
        required : true
     },
    //Passport - local - mongoose will automatically add username and password field in the schema, if we mention or not.
    //You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
});

userSchema.plugin(passportLocalMongoose);

const  User = mongoose.model("User",userSchema);

module.exports = User;