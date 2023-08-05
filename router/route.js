const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router();

// *adding user details into mongoDB
router.post("/register", async (req, res) => {
  try {
    const { name, email, uid, displayPicture } = req.body;

    const userFound = await User.findOne({ uid });
    if (userFound) {
      return res.status(422).json({ error: "User already exists!" });
    } else {
      const newUser = new User({
        name,
        uid,
        email,
        displayPicture,
      });
      const registerUser = await newUser.save();

      res.status(201).json({ message: "User registered successfully!!" });
    }
  } catch (error) {
    console.log(`error occured : ${error.message}`);
  }
});

// *get name and displayPicture from uid
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (user) {
      res
        .status(201)
        .json({ displayPicture: user.displayPicture, name: user.name });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.log(error.message);
  }
});

// *get products from userId
router.get("/products/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const products = await Product.find({ uid });
    res.json({ products });
  } catch (error) {
    console.log(error.message);
  }
});

// *add new product
router.post("/NewProduct", async (req, res) => {
  try {
    const { uid, title, description, price, images, variants } = req.body;

    const newProduct = new Product({
      title,
      description,
      uid,
      price,
      images,
      variants,
    });

    const addProduct = await newProduct.save();

    const allProducts = await Product.find();

    res.json({ products: allProducts, product: addProduct });
  } catch (error) {
    console.log(error.message);
  }
});

// *add image to product
router.post("/addImages", async (req, res) => {
  try {
    const { uid, productId, images } = req.body;
    let product = await Product.findById(productId);
    if (product) {
      if (product.uid == uid) {
        product.images = images;
        const updatedProduct = await product.save();
        res.json({ product: updatedProduct });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *add variant to product => the structure oof variants defined in the product is incorrect
//* variants are nothing but other products which are similar to the current product
//* so the variant should have a productId to show it.
// router.post("/AddVariant", async (req, res) => {
//   try {
//     const { productId, uid, name, price, image } = req.body;
//     let product = await Product.findById(productId);
//     if (product.uid == uid) {
//       product.variants.push({ name, price, image });
//       const updatedProduct = await product.save();
//       res.json({ variants: updatedProduct.variants });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// *add review to product
router.post("/AddReview", async (req, res) => {
  try {
    const { productId, uid, message, rating } = req.body;
    let product = await Product.findById(productId);
    product.reviews.push({ uid, message, rating });
    const updatedProduct = await product.save();
    res.json({ reviews: updatedProduct.reviews });
  } catch (error) {
    console.log(error.message);
  }
});

// *delete product
router.post("/DeleteProduct", async (req, res) => {
  try {
    const { uid, productId } = req.body;
    const product = await Product.findById(productId);
    if (product) {
      if (product.uid == uid) {
        const deletedProduct = await Product.deleteOne({ _id: productId });
        const products = await Product.find();
        res.json({ products });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *Edit product
router.patch("/EditProduct/:uid/:productId", async (req, res) => {
  try {
    const { uid, productId } = req.params;
    const { title, description, price } = req.body;
    const newData = req.body;

    const product = await Product.findById(productId);
    if (product) {
      if (product.uid == uid) {
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          newData
        );
        const products = await Product.find();
        res.json({ products, updatedProduct });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

// get product from its name
router.get("/product", async (req, res) => {
  const q = req.query.q;

  const product = await Product.find({ title: q });
  res.json({ product });
});

// search for product
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q.toLowerCase();

    let terms = q.split(" ");

    let curatedProducts = [];
    const product = await Product.find();

    terms.forEach((e) => {
      product.forEach((prd) => {
        if (!curatedProducts.includes(prd)) {
          if (prd.title.toLowerCase().includes(e)) {
            curatedProducts.push(prd);
          }
        }
      });
      curatedProducts.push();
    });

    // console.log(curatedProducts);
    res.json({ products: curatedProducts });
  } catch (error) {
    console.log(error.message);
  }
});

// get search suggestions
router.get("/SearchSuggestions", async (req, res) => {
  try {
    const products = await Product.find().limit(7);
    const titles = [];
    products.forEach((e) => {
      titles.push(e.title);
    });
    res.json({ titles });
  } catch (error) {
    console.log(error.mesage);
  }
});

module.exports = router;
