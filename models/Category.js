var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    categoryName:{
      type:String,
      default:""
    },
    imageUrl:{
      type:String,
    },
  },
  {
    timestamps: true,
    collection: "category",
  },
);



module.exports=mongoose.model("Category",categorySchema)
//export default mongoose.models.Category || mongoose.model("Category", categorySchema);
