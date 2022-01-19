const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Studentpersonal");


const studentSchema=new mongoose.Schema({
  name:{
      type:String,
      required:true
  },             
  email:{
      type:String,
      required:true
  },
  password:{
      type:String,
      required:true
  },
  img:
  {
    data:Buffer,
    type:String
  }
})
const StudentID= mongoose.model("StudentID",studentSchema);
var harry = new StudentID({  });
harry.save(function(err, harry ){
  if(err)return console.error(err);
})
module.exports=StudentID;