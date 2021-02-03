var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    ordered_objects: {
      list: { type: Array },
      price: { type: Number },
    },
    shipping_address: {
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
    },
    state: {
      type: String,
      enum: ["UNCHECKED", "CHECKED", "VALIDATED", "SENT"],
      default: "UNCHECKED",
    },
  },
  {
    timestamps: true,
    collection: "order",
  },
);
module.exports=mongoose.model("Order",orderSchema)
//export default mongoose.models.Order || mongoose.model("Order", orderSchema);
