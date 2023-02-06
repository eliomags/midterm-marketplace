const express = require("express");
const router = express.Router();
const { getAllItems, getFeaturedItems } = require("../db/queries/users");

// Set the view engine to ejs
app.set("view engine", "ejs");

// Serve the ejs files from a "views" folder
app.set("views", path.join(__dirname, "views"));

// request for viewing items split into featured and rest (Zack's crazy addition on Saturday)
app.get("/", (req, res) => {
  let options = {};
  if (req.query.min_price) {
    options.min_price = req.query.min_price;
  }
  if (req.query.max_price) {
    options.max_price = req.query.max_price;
  }
  Promise.all([getFeaturedItems(), getAllItems(6, options)])
    .then(([featuredItems, allItems]) => {
      res.render("items", { featuredItems, allItems });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

app.get("/items/:id", (req, res) => {
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
