import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import cors from "cors";


const app = express();
var corsOptions = {
    origin: '*',
    credentials: true
  }
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    secret: "personal secret",
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 2592000000}
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify:false});

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose,{usernameField: "email"});

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function noteFilter(elem){
    const {_id,key,title,content} = elem;
    return {
        key:key,
        title:title,
        content:content
    };
}
// LOGIN AUTHENTICATION


app.post("/register",(req,res)=>{
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.status(400).send("Unable to register user!");
        }   
        else{
            passport.authenticate("local")(req,res,()=>{
                res.status(200).send("Successfully registered user!");
            });
        }
    });


});
app.post("/login",(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    req.logIn(user, (err)=>{
        if(err){
            res.status(400).send("Unauthorized");
        }
        else{
            passport.authenticate("local")(req, res ,(err,user)=>{
                res.status(200).send("Logged in!");
            });
        }
    })
});

// STORING AND RETREIVING THE NOTES
const noteSchema = mongoose.Schema({
    email:String,
    notes:[{
        key:Number,
        title:String,
        content:String
    }]
});
const Note = mongoose.model("Note",noteSchema)
// ADDING NEW NOTE TO DATA BASE
app.put("/user",(req,res)=>{
    const {email,newNote} = req.body;
    console.log(newNote);
    Note.findOneAndUpdate({email:email},
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
    Note.findOneAndUpdate({email:email,"notes.key":newNote.key},
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
    Note.findOneAndUpdate({email:email},
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
//SENDING ALL NOTES RELATED TO USER
app.get("/user",(req,res)=>{
    Note.findOne({email:req.query.email},(err,notes)=>{
        if(err){
            res.json({});
        }
        else{
            let filteredNotes = []
            if(notes!==null){
                filteredNotes = (notes.notes).map(noteFilter);
            }
            res.json(filteredNotes);
        }
    });
});

app.listen(9000,()=>{
    console.log("server started at port 9000");
});