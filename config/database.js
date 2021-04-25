const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();

const db_string = process.env.DB_STRING;

mongoose.connect(db_string,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
});

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    notes:[{
        key:Number,
        title:String,
        content:String
    }]
});

userSchema.plugin(passportLocalMongoose,{
    usernameField:'email'
});

const User = mongoose.model('User',userSchema);


module.exports = User;