const express = require("express");
const router = express.Router();
const {
  getUserFavorites,
  deleteFavourite,
  addFavourite,
} = require("../db/queries/users");

// request for viewing user favourites
router.get("/favorites", (req, res) => {
  const userId = req.session.user_id;

  getUserFavorites(userId)
    .then((favorites) => {
      res.render("favorites", { favorites: favorites.rows });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Code to handle request for adding a favourite inside GET /items + /items/:id
router.post("/favourites", (req, res) => {
  let favourite = {
    user_id: req.body.user_id,
    listing_id: req.body.listing_id,
  };
  addFavourite(favourite)
    .then((result) => {
      res.status(200).json({ result });
      // res.redirect(`/items/${favourite.listing_id}`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request for removing a favourite by id
//option via Delete
router.delete("/favorites/:id", (req, res) => {
  const favourite = { id: req.params.id };
  deleteFavourite(favourite)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting favourite.");
    });
});

//options via post request
router.post("/favorites/:id/remove", (req, res) => {
  const favourite = { id: req.params.id };
  deleteFavourite(favourite)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting favourite.");
    });
});

module.exports = router;
