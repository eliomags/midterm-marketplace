const express = require("express");
const app = express();

// Index: Browse
app.get("/items", (req, res) => {
  const query = queries.SELECT_ALL_ITEMS;
  pool.query(query, (error, result) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.render("allitems", { items: result.rows });
    }
  });
});

app.get("/items", (req, res) => {
  // Code to handle request for filtered items by price
  const query = queries.SELECT_FILTERED_BY_PRICE_ITEMS;
  const priceRange = req.query.priceRange;
  pool.query(query, [priceRange], (error, result) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.render("filtereditems", { items: result.rows });
    }
  });
});

app.get("/favourites", (req, res) => {
  // Code to handle request for viewing favourites
  const userId = req.session.userId;
  const query = queries.SELECT_FAVORITES_BY_USER_ID;
  // Query the database to get the favorites for the current user
  db.query(query, [userId], (error, result) => {
    if (error) {
      return res.status(500).send({ error: error.message });
    }

    // Render the favorites view and pass the result to it
    res.render("favourites", { favorites: result.rows });
  });
});

app.get("/messages", (req, res) => {
  // Code to handle request for viewing messages
  const userId = req.session.userId;
  const query = queries.SELECT_MESSAGES_BY_USER_ID;
  if (!userId) {
    res.redirect("/login");
    return;
  }

  pool.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching messages");
      return;
    }

    const messages = result.rows;
    res.render("messages", { messages });
  });
});

app.get("/admin", (req, res) => {
  // Code to handle request for viewing current user's items
  const userId = req.session.userId;
  const query = queries.SELECT_ITEMS_BY_USER_ID;
  pool.query(query, [userId], (error, result) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.render("admin", { items: result.rows });
    }
  });
});

// Show: Read
app.get("/items/:id", (req, res) => {
  // Code to handle request for a specific item by id
  const itemId = req.params.id;
  const query = queries.SELECT_ITEM_BY_ID;

  pool.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }

    const item = result.rows[0];
    res.render("item", { item });
  });
});

app.get("/messages", (req, res) => {
  // Code to handle request for viewing messages
  const userId = req.session.userId;
  const query = queries.SELECT_MESSAGES_BY_USER_ID_GROUPED_BY_PRODUCT_ID;
  if (!userId) {
    res.redirect("/login");
    return;
  }
  pool.query(query, [userId, itemId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching messages");
      return;
    }

    const messages = result.rows;
    res.render("messages", { messages });
  });
});

app.get("/messages/:product_id/:user_id", (req, res) => {
  // Code to handle request for a specific message by product_id and user_i (buyer)
  const productId = req.params.product_id;
  const userId = req.params.user_id;
  const query = querries.SELECT_MESSAGES_BY_PRODUCT_ID_AND_USER_ID;

  pool.query(query, [productId, userId], (error, result) => {
    if (error) {
      return res.status(500).send({ error: error.message });
    }
    res.render("messages", { messages: result.rows });
  });
});

// Update: Edit
app.get("/items/:id/edit", (req, res) => {
  // Code to handle request for editing a specific item by id
  const itemId = req.params.id;
  const query = queries.SELECT_ITEM_BY_ID;

  pool.query(query, [itemId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("edititem", { item: result.rows[0] });
  });
});

app.post("/items/:id", (req, res) => {
  // Code to handle request for updating a specific item by id
  const itemId = req.params.id;
  const { name, description, price } = req.body;
  const query = queries.UPDATE_ITEM_BY_ID;

  pool.query(query, [name, description, price, itemId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/items/:id");
  });
});

// Create: Add
app.get("/items/new", (req, res) => {
  // Code to handle request for creating a new item
  res.render("newitem");
});

app.post("/items", (req, res) => {
  // Code to handle request for adding a new item
  const { name, description, price } = req.body;
  const query = queries.INSERT_ITEM;

  pool.query(query, [name, description, price], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/items");
  });
});

app.post("/favourites", (req, res) => {
  // Code to handle request for adding a favourite inside GET /items + /items/:id
  const { productId, userId } = req.body;
  const query = queries.INSERT_FAVOURITE;

  pool.query(query, [productId, userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect(`/items/${productId}`);
  });
});

app.get("/messages/:product_id/:user_id/new", (req, res) => {
  // Code to handle request for creating a new message
  const productId = req.params.product_id;
  const userId = req.params.user_id;
  res.render("newmessage", { productId, userId });
});

app.post("/messages/:product_id/:user_id", (req, res) => {
  // Code to handle request for adding a new message
  const productId = req.params.product_id;
  const userId = req.params.user_id;
  const { text } = req.body;
  const query = queries.INSERT_MESSAGE;

  pool.query(query, [productId, userId, text], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect(`:product_id/:user_id`);
  });
});

// Delete
app.post("/items/:id/delete", (req, res) => {
  // Code to handle request for deleting a specific item by id
  const itemId = req.params.id;
  const query = queries.DELETE_ITEM_BY_ID;
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
  const query = queries.DELETE_FAVOURITE_BY_ID;
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
