const express = require("express");
const router = express.Router();
const { getUserMessages, getConversation } = require("../db/queries/users");

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
