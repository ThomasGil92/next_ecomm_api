const Order = require("../models/Order");
const User = require("../models/User");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.SECRET_KEY);
const AWS = require("aws-sdk");
const { emailCheckoutSuccess } = require("../utils/email");

AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  /* region: process.env.AWS_REGION, */
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const _ = require("lodash");

exports.getOrder = (req, res, next, id) => {
  console.log(req.order);
  return res.json(req.order);
};
exports.getOrders = async (req, res) => {
  const orders = await Order.find();
  if (!orders) {
    return res.status(400).json({
      error: "Aucune commande trouvée",
    });
  }
  return res.status(200).json(orders);
};

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .then((order) => {
      console.log(order);
      res.status(200).json(order);
    })
    .catch((err) => console.log(err));
};

exports.createSession = async (req, res) => {
  try {
    const { total, address } = req.body;/* 
    total=Number.parseFloat(total).toFixed(2) */
    const t=total*100
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      /* shipping_address_collection:{
        allowed_countries:["FR"]
      }, */
      metadata: {
        first_name: address.first_name,
        last_name: address.last_name,
        address: address.address,
        zip_code: address.zip_code,
        country: address.country,
        city: address.city,
      },
      line_items: [
        {
          name: "test",
          images: ["https://picsum.photos/200"],
          currency: "eur",
          amount: Math.trunc(t),
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/cart/success",
      cancel_url: "https://example.com/cancel",
    });
    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

exports.getSessionCheckoutResult = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.csById);

    return res.status(200).json({ session });
  } catch ({ error, message }) {
    res.status(400).json({ error, message: "Aucune transaction trouvée" });
  }
};

exports.sendConfirmationEmail = async (req, res) => {
  try {
    const { email } = req.body.user;
    const { config } = req.body.cs;
    const user = await User.findOne({ email });
    console.log(user);
    console.log(JSON.parse(config.data));
    const params = emailCheckoutSuccess(email, JSON.parse(config.data));

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
          message: `We could not verify your email. Please try again`,
        });
      });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.saveNewOrder = async (req, res) => {
  try {
    User.findById(req.body.user._id).exec((err, user) => {
      if (!user) {
        return res.status(401).json({
          error: "Please try again",
        });
      }

      const newOrder = new Order({
        shipping_address: {
          first_name: user.first_name,
          last_name: user.last_name,
          address: user.address,
          country: user.country,
          zip_code: user.zip_code,
          city: user.city,
          email: user.email,
        },
        ordered_objects: {
          list: req.body.cart,
          price: Number.parseFloat(req.body.sub_total).toFixed(2),
        },
      });
      newOrder.save((err, result) => {
        if (err) {
          return res.status(401).json({
            error: err,
          });
        }
        user.orders.push(result._id);
        user.save((err, userUpdated) => {
          if (err) {
            return res.status(401).json({
              error: err,
            });
          }
        });
        return res.status(200).json({
          message: "Order have been successfully saved.",
        });
      });
    });
  } catch ({ error, message }) {
    res.status(400).json({ error, message });
  }
};
