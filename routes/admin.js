const express = require("express");
const router = express.Router();
const {
  getAdminListings,
  deleteListing,
  editSoldStatus,
  addListing,
  editItem,
  getItemById,
} = require("../db/queries/users");

// Code to handle request for editing a specific item by id
router.get("/items/:id/edit", (req, res) => {
  getItemById(req.params.id)
    .then((item) => {
      res.render("edititem", { item });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

router.post("/items/:id", (req, res) => {
  const id = req.params.id;
  const options = {
    title: req.body.title,
    description: req.body.description,
    photo_1: req.body.photo_1,
    photo_2: req.body.photo_2,
    photo_3: req.body.photo_3,
    photo_4: req.body.photo_4,
    price: req.body.price,
    sold_status: req.body.sold_status,
  };

  editItem(id, options)
    .then(() => {
      res.redirect(`/items/${id}`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// Create: Add
// get request for creating a new item
router.get("/items/new", (req, res) => {
  res.render("newitem");
});

// post request for adding a new item
router.post("/items", (req, res) => {
  let item = req.body;
  addListing(item)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request to edit Sold Status,
router.post("/items/:id", (req, res) => {
  let listing = {
    id: req.params.id,
    sold_status: req.body.sold_status,
  };
  editSoldStatus(listing)
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request for viewing current user's items
router.get("/admin", (req, res) => {
  const userId = req.session.user_id;
  getAdminListings(userId)
    .then((listings) => {
      res.render("admin-listings", { listings: listings.rows });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error");
    });
});

// Delete
// request for deleting a specific item by id
//option via Delete
router.delete("/items/:id", (req, res) => {
  const listing = { id: req.params.id };
  deleteListing(listing)
    .then((response) => {
      res.redirect("/admin");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting listing.");
    });
});
//options via post request
router.post("/items/:id/delete", (req, res) => {
  const listing = { id: req.params.id };
  deleteListing(listing)
    .then((response) => {
      res.redirect("/admin");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error deleting listing.");
    });
});
