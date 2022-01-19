const express = require("express");
const jwt=require('jsonwebtoken');
var multer  = require('multer');
const app = express();
const path = require("path");
const hbs = require("hbs");
const Register = require("./connect");

const port = process.env.PORT || 4898;

const template_path = path.join(__dirname, "../templates/views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const JWT_SECRET ='some super secret...';

//app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
app.use('/uploads', express.static('uploads'));
//hbs.registerPartials(partials_path);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  return res.send(response)
})

app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    for(var i=0;i<req.files.length;i++){
        response += `<img src="${req.files[i].path}" /><br>`
    }
    
    return res.send(response)
})
  

app.get("/",(req,res)=>{
  res.render("firstpage")
});

app.get("/firstpage", (req, res) => {
  res.render("firstpage");
});

app.get("/signuppage", (req, res) => {
  res.render("signuppage");
});

app.get("/studentpage", (req, res) => {
  res.render("studentpage");
});

app.get("/images", (req, res) => {
  res.render("images");
});

app.get("/loginpage", (req, res) => {
  res.render("loginpage");
});

app.get("/notes", (req, res) => {
  res.render("notes");
});

app.post("/signuppage", async (req, res) => {
  try {
    const registerEmployee = new Register({
      name: req.body.name,
      
      email: req.body.email,
      password: req.body.password,
    })

    const registered = await registerEmployee.save();
    res.status(201).render("studentpage");

  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/loginpage", async(req, res) => {
  
  try {
    const email=req.body.email;
    const password=req.body.password;

    const useremail=await Register.findOne({email:email});
     
    if(useremail.password==password){
      res.status(201).render("studentpage");
    }else{
      res.send("passwords are not matching");
    }

  } catch (error) {
    res.status(400).send("invalid Email"); 
  }
});
// const {email}=req.body;
// const useremail= Register.findOne({email:email});
app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

app.post("/forgotpassword",async(req,res)=>{
  const {email}=req.body;
  const useremail=await Register.findOne({email:email});
     
    if(useremail==email){
      res.send("User is registered");
      
    }
    else{
     const secret=JWT_SECRET+useremail.password;
     const payload={
       email:useremail,
       name:useremail.name
     }
     const token=jwt.sign(payload,secret,{expiresIn:"15m"});
     const link=`http://localhost:5698/resetpassword/${useremail.name}/${token}`;
     console.log(link);
     res.send("password link has been reset"); 
    }   
});
app.get("/resetpassword/:name/:token",(req,res)=>{
  const{name,token}=req.params;
  const {email}=req.body;
  const useremail= Register.findOne({email:email});
  if(name==useremail.name){
    res.send("invalid name...");    
  }
  const secret=JWT_SECRET+useremail.password;
  try {
    const payload=jwt.verify(token,secret)
    res.render("resetpassword",{email:useremail});
  } catch (error) {
    res.send(error.message);
  }
    
});

app.post("/resetpassword/:name/:token",(req,res)=>{
  const{name,token}=req.params;
  const{password,password2}=req.body;
  if(name==useremail.name){
    res.send("invalid id...");
    return;
  }
  else{
  const secret=JWT_SECRET+useremail.password;
  try {
    const payload=jwt.verify(token,secret);
    useremail.password=password;
    res.send(useremail);
    res.render("resetpassword",{email:useremail});
  } catch (error) {
    res.send(error .message);
  }
      }
})


app.listen(port, () => {
  console.log(`server running on port ${port}`);
})