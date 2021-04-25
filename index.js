const  express = require( "express");
const  mongoose = require( "mongoose");
const  session = require( "express-session");
const  passport = require( "passport");
const  cors = require( "cors");
const MongoStore = require('connect-mongo');
require('dotenv').config();

const User = require('./config/database');
const app = express();
const db_string = process.env.DB_STRING;


const sessionStore = MongoStore.create({
    mongoUrl:db_string,
    collectionName:'sessions'
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    store:sessionStore,
    cookie:{
        maxAge:2629800000
    }
}));
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


function noteFilter(elem){
    const {_id,key,title,content} = elem;
    return {
        key:key,
        title:title,
        content:content
    };
}
// LOGIN AUTHENTICATION

app.post('/register',(req,res)=>{
    const newUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email
    });
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            res.status(401).json({loggedIn:false,msg:'Something went wrong. Try again!'});
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                res.status(200).json({loggedIn:true,msg:"Successfully logged in!",notes:req.user.notes});
            })
        }
    })
});

app.post('/login',passport.authenticate('local'),(req,res)=>{
    res.status(200).json({loggedIn:true,msg:"Successfully logged in!",notes:req.user.notes});
})
// STORING AND MODIFYING THE NOTES

// ADDING NEW NOTE TO DATA BASE
app.put("/user",(req,res)=>{
    const {email,newNote} = req.body;
    console.log(newNote);
    User.findOneAndUpdate({email:email},
        {$push:{"notes":newNote}},
        {safe: true, upsert: true, new : true},
        (err,model)=>{
            if(err){
                console.log(err);
                res.json({responseText:"Unable to add note!"});
            }
            else{
                res.json({responseText:"Note Added!"});
            }
        }
    );
});
//MODIFYING AN EXISTING NOTE
app.patch("/user",(req,res)=>{
    const {email,newNote} = req.body;
    User.findOneAndUpdate({email:email,"notes.key":newNote.key},
        {$set:{"notes.$.title":newNote.title,"notes.$.content":newNote.content}},
        {safe: true, upsert: true, new : true},
        (err,model)=>{
            if(err){
                console.log(err);
                res.json({responseText:"Unable to modify note!"});
            }
            else{
                res.json({responseText:"Note Modified!"});
            }
        }

    );
});
//DELETING A NOTE USING KEY
app.delete("/user",(req,res)=>{
    const {email,key} = req.query;
    User.findOneAndUpdate({email:email},
        {$pull:{notes:{key:key}}},
        {safe: true, upsert: true, new : true},
        (err,model)=>{
            if(err){
                console.log(err);
                res.json({responseText:"Unable to delete note!"});
            }
            else{
                res.json({responseText:"Note Deleted!"});
            }
        }

    );
});

app.listen(9000,()=>{
    console.log("server started at port 9000");
});