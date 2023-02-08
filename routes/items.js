const express = require("express");
const router = express.Router();
const { getAllItems, getFeaturedItems } = require("../db/queries/users");

// request for viewing items split into featured and rest (Zack's crazy addition on Saturday)
router.get("/", (req, res) => {
  let options = {};
  if (req.query.min_price) {
    options.min_price = parseInt(req.query.min_price);
  }
  if (req.query.max_price) {
    options.max_price = parseInt(req.query.max_price);
  }
  Promise.all([getFeaturedItems(), getAllItems(6, options)])
    .then(([featuredItems, allItems]) => {
      console.log(featuredItems);
      res.render("items", {
        featuredItems,
        allItems,
        userId: req.cookies.user_id,
        priceRange: {
          min_price: options.min_price,
          max_price: options.max_price,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

router.get("/items/:id", (req, res) => {
  getItemById(req.params.id)
    .then((item) => {
      res.render("item", { item });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
