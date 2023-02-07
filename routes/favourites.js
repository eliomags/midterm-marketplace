const express = require("express");
const router = express.Router();
const {
  getUserFavourites,
  deleteFavourite,
  addFavourite,
} = require("../db/queries/users");

// request for viewing user favourites
router.get("/", (req, res) => {
  console.log("user_id", req.cookies.user_id);
  const userId = req.cookies.user_id;

  getUserFavourites(userId)
    .then((favourites) => {
      res.render("favourites", { favourites: favourites, userId });
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
router.delete("/favourites/:id", (req, res) => {
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
router.post("/favourites/:id/remove", (req, res) => {
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
