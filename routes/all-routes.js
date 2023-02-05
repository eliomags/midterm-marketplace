const express = require("express");
const app = express();

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

// request for viewing favourites
router.get("/favorites/:userId", (req, res) => {
  const userId = req.params.userId;

  getUserFavorites(userId)
    .then((favorites) => {
      res.render("favorites", { favorites: favorites.rows });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// request for viewing messages
app.get("/user-messages/:userId", (req, res) => {
  const userId = req.params.userId;

  getUserMessages(userId)
    .then((messages) => {
      res.render("user-messages", { messages: messages.rows });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// Code to handle request for viewing current user's items
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

// Show: Read

//request for a specific item by id
app.get("/items/:id", (req, res) => {
  const itemId = req.params.id;
  getItemById(itemIdd)
    .then((item) => {
      res.render("item-details", { item: item.rows });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error");
    });
});

// request for a specific message by product_id and user_i (buyer)
app.get("/conversation", (req, res) => {
  const senderId = req.query.senderId;
  const receiverId = req.query.receiverId;
  const listingId = req.query.listingId;

  getConversation(senderId, receiverId, listingId)
    .then((conversation) => {
      res.render("conversation", { conversation });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error");
    });
});

// Update: Edit

// Code to handle request for editing a specific item by id
app.get("/items/:id/edit", (req, res) => {
  getItemById(req.params.id)
    .then((item) => {
      res.render("edit-item", { item });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

app.post("/items/:id", (req, res) => {
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
app.get("/items/new", (req, res) => {
  res.render("newitem");
});

// post request for adding a new item
app.post("/items", (req, res) => {
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

app.post("/favourites", (req, res) => {
  // Code to handle request for adding a favourite inside GET /items + /items/:id
  const { productId, userId } = req.body;
  const query = queries.addFavourite;

  pool.query(query, [productId, userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect(`/items/${productId}`);
  });
});

app.post("/favourites", (req, res) => {
  let favourite = {
    user_id: req.body.user_id,
    listing_id: req.body.listing_id,
  };
  addFavourite(favourite)
    .then((result) => {
      res.status(200).json({ result });
      res.redirect(`/items/${favourite.listing_id}`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request for creating a new message
app.get("/messages/:item_id/:user_id/new", (req, res) => {
  const item_id = req.params.listing_id;
  const user_id = req.params.user_id;
  res.render("newmessage", { item_id, user_id });
});

// request for adding a new message
app.post("/messages/:item_id/:user_id", (req, res) => {
  let message = {
    sender: req.body.sender,
    receiver: req.body.receiver,
    listing: req.body.listing,
    text: req.body.text,
  };
  createMessage(message)
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request to edit Sold Status,
app.post("/items/:id", (req, res) => {
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

// Delete
app.post("/items/:id/delete", (req, res) => {
  // Code to handle request for deleting a specific item by id
  const itemId = req.params.id;
  const query = queries.deleteListing;
  pool.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/items");
  });
});

app.post("/favourites/:id/remove", (req, res) => {
  // Code to handle request for removing a favourite by id
  const favouriteId = req.params.id;
  const query = queries.deleteFavourite;
  pool.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/favourites");
  });
});

app.listen(3000, () => {
  console.log("Marketplace app listening on port 3000!");
});

module.exports = router;
