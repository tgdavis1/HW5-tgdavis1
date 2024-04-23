const express = require("express");
const Product = require("../models/product.js");
const User = require("../models/user.js");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

//buys a product
router.post("/products/buy", authenticateUser, async (req, res) => {
  //find product
  const product = await Product.findOne({ _id: req.body.productID });
  //if buyer already owns
  if (req.user._id == product.owner)
    res.send("Oops, " + req.user.user_name + " already owns this item");
  if (req.user._id != product.owner) {
    //if buyer doesnt have enough money
    if (req.user.balance < product.price)
      res.send("Oops, " + req.user.user_name + " has insufficient funds");
    if (req.user.balance >= product.price) {
      //find owner
      const Seller = await User.findById(product.owner);
      //update buyers info
      await User.updateOne({ _id: req.user._id });
      //update seller balance
      await User.updateOne({ _id: Seller._id });
      //update items owner
      await Product.updateOne({ _id: product._id });
      res.send("Transaction successful!");
    }
  }
});

//displays all products
router.get("/products", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

//creates a product
router.post("/products", authenticateUser, async (req, res) => {
  const newProd = new Product({
    name: req.body.name,
    price: req.body.price,
    owner: req.user._id,
  });
  const response = await newProd.save();
  res.send(response);
});

//deletes a product by id
router.delete("/products/:id", authenticateUser, async (req, res) => {
  const id = req.params.id;
    const userID=req.user._id+""
  const item = await Product.findOne({ _id: id });
  const itemOwner=item.owner+""
  //console.log(itemOwner+"=="+userID)
  //console.log(itemOwner==userID)
  if (item.owner != userID){
    res.send({ Error: "You Do Not Own This Item" });
  } else {
    let deleted = await Product.deleteOne({ _id: id });
    res.send(deleted);
  }
});

module.exports = router;
