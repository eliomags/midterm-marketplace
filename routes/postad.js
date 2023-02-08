const express = require("express");
const router = express.Router();
const {
  addListing
} = require("../db/queries/users");

// Create: Add
// get request for creating a new item
router.get("/", (req, res) => {
  const userId = req.cookies.user_id;
  let priceRange = {};
  priceRange.min_price = parseInt(req.query.min_price);
  priceRange.max_price = parseInt(req.query.min_price);

  res.render("postad", {
    userId,
    priceRange,
  });
});

// post request for adding a new item
router.post("/", (req, res) => {
  let item = req.body;
  item.owner_id = req.cookies.user_id;
  addListing(item)
    .then(() => {
      res.redirect("/admin");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
