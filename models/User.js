var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  { ObjectId } = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    zip_code: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      rquired: true,
    },
    email: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    resetPasswordLink: {
      data: String,
      default: "",
    },
    orders: [
      {
        type: ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
    collection: "user",
  },
);

userSchema
  .virtual("password")
  .set(function (password) {
    // create temp variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports=mongoose.model("User",userSchema)
//export default mongoose.models.User || mongoose.model("User", userSchema);
