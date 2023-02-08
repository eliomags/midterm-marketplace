const express = require("express");
const router = express.Router();
// const {
//   getUserFavourites,
//   deleteFavourite,
//   addFavourite,
// } = require("../db/queries/users");

// Create: Add
// get request for creating a new item
router.get("/", (req, res) => {
  const userId = req.cookies.user_id;

  res.render("postad", { userId });
});

module.exports = router;
