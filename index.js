const  express = require( "express");
const  session = require( "express-session");
const  passport = require( "passport");
const  cors = require( "cors");
const MongoStore = require('connect-mongo');
require('dotenv').config();

const User = require('./config/database');
const app = express();
const db_string = process.env.DB_STRING;

app.set('trust proxy', 1);
const sessionStore = MongoStore.create({
    mongoUrl:db_string,
    collectionName:'sessions'
});

const corsOption = {
    origin:'https://keep-er.netlify.app',
    credentials:true
}
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    store:sessionStore,
    cookie:{
        maxAge:2629800000,
        sameSite:'none',
        secure:true
    }
}));
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());





// LOGIN AUTHENTICATION

app.get('/loginStatus',(req,res)=>{
    if(req.isAuthenticated()){
        const {firstName,lastName,email,notes} = req.user;
        res.json({loggedIn:true,msg:"Successfully logged in!",user:{firstName,lastName,email,notes}});
    }
    else{
        res.json({loggedIn:false,msg:"Login failed!!"});
    }
})
app.get('/logout',(req,res)=>{
    req.logout();
    res.json("User logged Out!");
})
app.post('/register',(req,res)=>{
    const newUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email
    });
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            res.json({loggedIn:false,msg:'Something went wrong. Try again!'});
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                const {firstName,lastName,email,notes} = req.user;
                res.json({loggedIn:true,msg:"Successfully registered in!",user:{firstName,lastName,email,notes}});
            })
        }
    })
});

app.post('/login',passport.authenticate('local',{failWithError:true}),(req,res,next)=>{
        const {firstName,lastName,email,notes} = req.user;
        res.json({loggedIn:true,msg:"Successfully logged in!",user:{firstName,lastName,email,notes}});
    },
    (err,req,res,next)=>{
        res.json({loggedIn:false,msg:"Login failed!!"});
    }

)
// STORING AND MODIFYING THE NOTES

// ADDING NEW NOTE TO DATA BASE
app.put("/user",(req,res)=>{
    const {email,newNote} = req.body;
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
    const {email,noteData:newNote} = req.body;
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
app.delete("/user/:email/:key",(req,res)=>{
    const {email,key} = req.params;
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

app.listen(process.env.PORT || 9000,()=>{
    console.log("server started at port 9000");
});