const Admin = require("../models/Admin");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const { registerEmailParamsForAdmin } = require("../utils/email");

AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.adminSignin=async(req,res)=>{
        const { email, password } = req.body
    try {
        Admin.findOne({ email }).exec((err, admin) => {
            if (err || !admin) {
                return res.status(400).json({
                    error: 'Admin with that email does not exist. Please register.'
                });
            }
            // authenticate
            if (!admin.authenticate(password)) {
                return res.status(400).json({
                    error: 'Email and password do not match'
                });
            }
            // generate token and send to client
            const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { _id, email, role,completed_profile,name } = admin;
    
            return res.status(200).json({
                token,
                admin: { _id, email, role,completed_profile,name }
            })
        });
      } catch (error) {
        res.status(400).json({ error: error });
      }
}

exports.getAdminById = async (req, res) => {
  try {
    const id = req.params.adminId;
    const admin = await Admin.findById(id);
    console.log(admin);
    return res.status(200).json(admin);
  } catch (err) {
    console.log(err);
    return res.status(400).json("Aucun administrateur trouvé");
  }
};

exports.activateAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin !== null) {
      return res.status(400).json({ error: "admin already exist" });
    }
    const token = jwt.sign(
      { email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      },
    );
    const params = registerEmailParamsForAdmin(email, token);
    var sendEmailOnRegister = ses.sendEmail(params).promise();
    sendEmailOnRegister
      .then((data) => {
        console.log("email submitted to SES", data);
        res.json({
          message: `Email has been sent to ${email}, Follow the instructions to complete your registration`,
        });
      })
      .catch((error) => {
        console.log("ses email on register", error);
        res.json({
          error,
          message: `We could not verify your email. Please try again`,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(405);
  }
};

exports.updateEmail = async (req, res) => {
  console.log(req.body);

  try {
    const { email, name } = req.body.profile;
    const admin = await Admin.findOneAndUpdate(
      req.body.profile._id,
      { $set: { email, name } },
      { new: true },
      /* 
            { new: true },*/
    );
    console.log(admin);
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, role, completed_profile } = admin;

    return res.status(200).json({
      token,
      admin: { _id, email, role, completed_profile, name },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updatePassword = async (req, res) => {
  const { _id, email, name, password } = req.body.profile;

  try {
    const admin = await Admin.findOneAndUpdate(
      { _id },
      { $set: { email, name } },
      { new: true },
    );
    admin.password = password;
    console.log("admin:", admin);
    admin.save((err, result) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update failed",
        });
      }
      console.log("result:", result);
      const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { email, role, completed_profile } = admin;

      return res.status(200).json({
        token,
        admin: { _id, email, role, completed_profile },
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
