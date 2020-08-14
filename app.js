//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/secureDB",{ useNewUrlParser: true, useUnifiedTopology: true });

const secureSchema= new mongoose.Schema({
  email:String,
  password:String
});

secureSchema.plugin(encrypt,{secret:process.env.secret, encryptedFields:["password"]});
const Secure=new mongoose.model("Secure",secureSchema);

app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const s1=new Secure({
    email:req.body.username,
    password:req.body.password
  });
  s1.save(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Done");
      res.render("secrets");
    }
  })
});

app.post("/login",function(req,res){
  const user=req.body.username;
const pass=(req.body.password);

  Secure.findOne({email:user},function(err,userFound){
    if(err){
      console.log(err);
    }else {
      if(userFound){
      if(userFound.password===pass){
        res.render("secrets");
      }
     }
    }
  });
});

app.listen(3000,function(){
  console.log("App running on port 3000");
});
