
const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel");


let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

const createIntern = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "data must be given" })

        if (!data.name) return res.status(400).send({ status: false, msg: "Name is Requried" })
        if (!data.email) return res.status(400).send({ status: false, msg: "Email is Requried" })
        if (!data.mobile) return res.status(400).send({ status: false, msg: "Mobile Number is Requried" })
          // if ((data.mobile).toString().length != 10) return res.status(400).send({ status: false, msg: "Mobile number should be of 10 digit" })
          let val = data.mobile
          if (/^\d{10}$/.test(val)) {
              // value is ok, use it
          } else {
              // Invalid number; must be ten digits
              // number.focus()
              return res.status(400).send({ status: false, msg: "Mobile number should be of 10 digit and should contain Numbers Only" })
          }
          let checkMobile = await internModel.findOne({ mobile: data.mobile })
          if (checkMobile) return res.status(400).send({ status: false, msg: "Mobile number must be unique" })
        if (!data.collegeName) return res.status(400).send({ status: false, msg: "College name is Requried" })


        let mailFormat = regex.test(data.email)
        if (mailFormat == false) return res.status(400).send({ status: false, msg: "email not valid" })

        let checkEmail = await internModel.findOne({ email: data.email })
        if (checkEmail) return res.status(400).send({ status: false, msg: "Email must be unique" })

      

      

        if (data.isDeleted == true) return res.status(400).send({ status: false, msg: "You can not set deleted to true" })

        let collegeid = await collegeModel.findOne({ name: data.collegeName }).select({ _id: 1 })
        if (!collegeid) return res.status(400).send({ status: false, msg: "Enter a valid college name" })
        data.collegeId = collegeid._id
        delete data.collegeName

        let intern = await internModel.create(data);
        return res.status(201).send({ status: true, data: intern })
    }
    catch (e) {
        res.status(500).send({ status: false, msg: e.message })
    }
}


module.exports.createIntern = createIntern