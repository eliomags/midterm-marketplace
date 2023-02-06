const express = require("express");
const router = express.Router();
const {
  getUserMessages,
  getConversation,
  createMessage,
} = require("../db/queries/users");

// request for viewing messages
router.get("/messages", (req, res) => {
  const userId = req.params.userId;

  getUserMessages(userId)
    .then((messages) => {
      res.render("messages", { messages: messages.rows });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request for a specific message by product_id and user_i (buyer)
router.get("/messages/:listing_id/:user_id", (req, res) => {
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

// request for creating a new message
router.get("/messages/:listing_id/:user_id/new", (req, res) => {
  const item_id = req.params.listing_id;
  const user_id = req.params.user_id;
  res.render("newmessage", { item_id, user_id });
});

// request for adding a new message
router.post("/messages/:item_id/:user_id", (req, res) => {
  let message = {
    sender: req.body.sender,
    receiver: req.body.receiver,
    listing: req.body.listing,
    text: req.body.text,
  };
  createMessage(message)
    .then((result) => {
      res.status(200).json({ result });
      res.render("messages");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
