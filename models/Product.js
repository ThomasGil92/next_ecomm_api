var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  { ObjectId } = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    imageUrl:{
      type:String,
      default:"http://via.placeholder.com/290x290/ffc107/ffffff/?text=Exemple+d%27image+290x290"
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    categorie: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "product",
  },
);
module.exports=mongoose.model("Product",productSchema)
/* export default mongoose.models.Product ||
  mongoose.model("Product", productSchema); */
