const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getFeaturedItems,
  getUserFavorites,
} = require("../db/queries/users");

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

/*
// request for viewing all items with option to filter by price
app.get("/", (req, res) => {
  let options = {};
  if (req.query.min_price) {
    options.min_price = req.query.min_price;
  }
  if (req.query.max_price) {
    options.max_price = req.query.max_price;
  }

  getAllItems(6, options)
    .then((items) => {
      res.render("items", { items: items.rows });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error");
    });
});

// request for viewing featured items
app.get("/featured", (req, res) => {
  getFeaturedItems()
    .then((featured) => {
      res.render("featured", { featured: featured.rows });
    })
    .catch((error) => {
      res.send("Error");
    });
});
*/

// request for viewing user favourites
app.get("/favorites/:userId", (req, res) => {
  const userId = req.params.userId;

  getUserFavorites(userId)
    .then((favorites) => {
      res.render("favorites", { favorites: favorites.rows });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// request for viewing current user's items
app.get("/admin-listings", (req, res) => {
  const userId = req.session.userId;
  getAdminListings(userId)
    .then((listings) => {
      res.render("admin-listings", { listings: listings.rows });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error");
    });
});

module.exports = router;
