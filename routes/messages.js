const express = require("express");
const router = express.Router();
const {
  getUserMessages,
  getConversation,
  createMessage,
} = require("../db/queries/users");

// request for viewing messages
router.get("/", (req, res) => {
  const userId = req.cookies.user_id;
  let priceRange = {};
  priceRange.min_price = parseInt(req.query.min_price);
  priceRange.max_price = parseInt(req.query.min_price);
  // const listing_id = req.params.listing_id;

  getUserMessages(userId)
    .then((messages) => {
      console.log("messages", messages);
      res.render("messages", { messages: messages, userId, priceRange });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

// request for a specific message by product_id and user_i (buyer)
router.get("/:listing_id/:senderId/:receiverId", (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const listingId = req.params.listing_id;

  console.log(senderId, receiverId, listingId, "newconsolelog", req.query)
  const userId = req.cookies.user_id;
  let priceRange = {};
  priceRange.min_price = parseInt(req.query.min_price);
  priceRange.max_price = parseInt(req.query.min_price);


  getConversation(senderId, receiverId, listingId)
    .then((conversation) => {
      console.log(conversation, "conversation")
      res.render("conversation", {
        conversation,
        userId,
        listingId,
        receiverId,
        priceRange,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error");
    });
});

// request for creating a new message
router.get("/messages/:listing_id/new", (req, res) => {
  const item_id = req.params.listing_id;
  const userId = req.cookies.user_id;
  let priceRange = {};
  priceRange.min_price = parseInt(req.query.min_price);
  priceRange.max_price = parseInt(req.query.min_price);
  res.render("newmessage", { item_id, userId, priceRange });
});

// request for adding a new message
router.post("/", (req, res) => {
  let message = {
    sender: req.body.senderId,
    receiver: req.body.receiverId,
    listing: req.body.listingId,
    text: req.body.message,
  };
  let userId = req.cookies.user_id;
  let priceRange = {};
  priceRange.min_price = parseInt(req.query.min_price);
  priceRange.max_price = parseInt(req.query.min_price);
  createMessage(message)
    .then((result) => {
      // res.status(200).json({ result });
      // res.render("messages", { message, userId, priceRange });
      res.redirect(`/messages/${message.listing}/${message.sender}/${message.receiver}`)
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
