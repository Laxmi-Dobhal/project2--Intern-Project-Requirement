const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const createClg = async function (req, res) {
  try {
      let data = req.body
      if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "data must be given" })

      if (!data.name) return res.status(400).send({ status: false, msg: "Name is Requried" })
     let Name  = /^[A-Za-z\s]+$/.test(data.name)
     if(!Name) return res.status(400).send({status: false,meg:"college name should not be number"})
      if (!data.fullName) return res.status(400).send({ status: false, msg: "Full Name is Required" })
      if (!data.logoLink) return res.status(400).send({ status: false, msg: "Logolink is Requried" })

      const isValidLink = function (value) {
          if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(value.trim()))) {
              return false
          }
          return true
      }
      if (!isValidLink(data.logoLink)) return res.status(400).send({ status: false, msg: "Logo link is not valid" })

      if (data.isDeleted == true) return res.status(400).send({ status: false, msg: "You can not set deleted to true" })

      let name = (data.name).toLowerCase()
      // data.name = name
      let checkName = await collegeModel.findOne({ name: name })
      if (checkName) return res.status(400).send({ status: false, msg: "college name must be unique" })


      if (data.name.split(" ").length > 1) {
          return res.status(400).send({ status: false, msg: "please provide the Valid Abbreviation" });
      }


      let college = await collegeModel.create(data);
      return res.status(201).send({ status: true, data: college })
  }
  catch (e) {
      res.status(500).send({ status: false, msg: e.message })
  }
}

/////////////////////////*GET API*////////////////////////////////
let  getcolleges=  async function(req,res){

  let data= req.query
  if(!data.collegeName){
  
    return res.status(400).send({msg: "please provide a college name "})
  }
  
  let collegematch= await collegeModel.find({$and:[{name: data.collegeName}, {isDeleted: false}]})
  //console.log(collegematch)
  
  if(collegematch.length<=0){
    return res.status(400).send({msg: "no such college exist in our DB"})
  }
  
  //console.log(collegematch[0]._id)
  
  let search=collegematch[0]._id
  
  let Interested = await internModel.find({collegeId: search}).select({name:1,email:1,mobile:1})
  
  //console.log(Interested)
  
  if(Interested.length >0){
  
    const finaldata= {
     name: collegematch[0].name,
     fullName: collegematch[0].fullName,
     interests: Interested}
    collegematch.push(Interested)
  
  res.status(200).send({data:finaldata})
  
  
  }
  if(Interested.length <=0){
  
    const finaldata= {
     name: collegematch[0].name,
     fullName: collegematch[0].fullName,
     interests: " no student has applied for internship"}
  //  collegematch.push(Interested)
  
  res.status(200).send({data:finaldata})
  }
  }


module.exports.createClg  = createClg 
module.exports. getcolleges =  getcolleges