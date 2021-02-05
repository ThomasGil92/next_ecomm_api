const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { registerEmailParamsForUser } = require("../utils/email");

AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.userById = async (req, res) => {
  const id = req.params.userId;
  console.log("id:",id)
  try {
    User.findById(id).exec((err, user, next) => {
      console.log(user);
      if (err || !user) {
        return res.status(400).json({
          error: "L'utilisateur n'a pas été trouvé",
        });
      }
      req.user = user;

      return res.status(200).json({user});
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.userSignin = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Admin with that email does not exist. Please register.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, email } = user;

    return res.status(200).json({
      token,
      user: { _id, email },
    });
  });
};

exports.userEmailConfirmation = async (req, res) => {
  const {
    first_name,
    last_name,
    address,
    zip_code,
    city,
    country,
    email,
    password,
  } = req.body.userFields;
  console.log(req.body.userFields)
  const user = await User.findOne({ email });
  if (user !== null) {
    return res.status(400).json({ error: "This user already exist" });
  }
  const token = jwt.sign(
    {
      first_name,
      last_name,
      address,
      zip_code,
      city,
      country,
      email,
      password,
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "10m",
    },
  );
  console.log(token);
  console.log(req.body);
  const params = registerEmailParamsForUser(email, token);
  console.log(params);
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
        message: `We could not verify your email. Please try again`,error
      });
    });
};

exports.userSignup = async (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link. Try again",
          });
        }
        const {
          first_name,
          last_name,
          address,
          zip_code,
          city,
          country,
          email,
          password,
          orders,
        } = jwt.decode(token);
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            return res.status(401).json({
              error: "User already exist",
            });
          }
        });

        const newUser = new User({
          first_name,
          last_name,
          address,
          zip_code,
          city,
          country,
          email,
          password,
          orders,
        });
        newUser.save((err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Try later",
            });
          }
          return res.status(200).json({
            message: "Registration success. Please login.",
            result,
          });
        });
      },
    );
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.userAddressUpdate = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      req.body.state,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: user });
  } catch ({ error }) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.userPasswordUpdate = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body.state;
  try {
    jwt.verify(
      req.body.token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log(err);
          return res.status(401).json({
            error: "Expired link. Try again",
          });
        }

        User.findOne({ email }).exec((err, user) => {
          console.log(user);
          console.log("email:", email);
          user.password = password;
          user.save((err, result) => {
            if (err) {
              console.log("USER UPDATE ERROR", err);
              return res.status(400).json({
                error: "User update failed",
              });
            }
            console.log(result);
          });
        });
        return res.status(200).json({ message: "Password updated" });
      },
    );
  } catch ({ error }) {
    console.log(error);
    res.status(400).json({ error });
  }
};
