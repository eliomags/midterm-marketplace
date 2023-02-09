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
  let priceRange = {};
  priceRange.min_price = parseInt(req.query.min_price);
  priceRange.max_price = parseInt(req.query.min_price);

  getUserFavourites(userId)
    .then((favourites) => {
      console.log(favourites, "favourites");
      res.render("favourites", {
        favourites: favourites,
        userId,
        priceRange,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Code to handle request for adding a favourite inside GET /items + /items/:id
router.post("/", (req, res) => {
  console.log("inside favourites route");
  console.log(req.body);
  let favourite = {
    user_id: req.cookies.user_id,
    listing_id: req.body.listing_id,
  };
  console.log(favourite);
  addFavourite(favourite)
    .then((result) => {
      console.log("result from addfavourite", result);
      // get the updated list of favourites for the user
      getUserFavourites(favourite.user_id).then((favourites) => {
        res.status(200).json({ favourites });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request for removing a favourite by id
// option via Delete
router.delete("/:id", (req, res) => {
  let favourite = {
    user_id: req.cookies.user_id,
    listing_id: req.body.listing_id,
  };
  deleteFavourite(favourite)
    .then((response) => {
      console.log("mentor asked to add", response);
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting favourite.");
    });
});

// // options via post request
// router.post("/favourites/:id/remove", (req, res) => {
//   const favourite = { id: req.params.id };
//   deleteFavourite(favourite)
//     .then((response) => {
//       res.send(response);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send("Error deleting favourite.");
//     });
// });

module.exports = router;
