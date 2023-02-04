const { response } = require('express');
const { user } = require('pg/lib/defaults');
const users = require('../../routes/users');
const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getAllItems = function(limit = 6, options = {min_price: null, max_price: null}) {
  const queryParams = [];
  let queryString = `
    SELECT listings.*
    FROM listings
    WHERE 1 = 1
    `;

    if (options.min_price) {
      queryParams.push(options.min_price);
      queryString += `AND price >= $${queryParams.length} `;
    }

    if (options.max_price) {
      queryParams.push(options.max_price);
      queryString += `AND price <= $${queryParams.length} `;
    }

    queryParams.push(limit);
    queryString += `ORDER BY price DESC
      LIMIT $${queryParams.length};`;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getFeaturedItems = function() {
  let queryString = `
    SELECT listings.*
    FROM listings
    WHERE featured_status = true;
    `;

  return db.query(queryString)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserFavorites = function(userId) {
  const queryParams = [userId];
  let queryString = `
    SELECT listings.*
    FROM listings
    JOIN favorites ON favorites.listing_id = listings.id
    WHERE favorites.user_id = $1;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserMessages = function(userId) {
  const queryParams = [userId];
  let queryString = `
    SELECT user_messages.message, sender.name, listings.title
    FROM user_messages
    JOIN users AS sender ON user_messages.sender = sender.id
    JOIN users AS receiver ON user_messages.receiver = receiver.id
    JOIN listings ON user_messages.listing = listings.id
    WHERE sender.id = $1
    GROUP BY listings.title, sender.name, user_messages.message;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getAdminListings = function(userId) {
  const queryParams = [userId]
  let queryString = `
    SELECT listings.*
    FROM listings
    JOIN users on listings.owner_id = users.id
    WHERE users.id = $1;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getConversation = function(senderId, receiverId, listingId) {
  const queryParams = [senderId, receiverId, listingId];
  let queryString = `
    SELECT user_messages.message, sender.name, receiver.name, listings.title
    FROM user_messages
    JOIN users AS sender ON user_messages.sender = sender.id
    JOIN users AS receiver ON user_messages.receiver = receiver.id
    JOIN listings ON user_messages.listing = listings.id
    WHERE sender.id = $1
    AND receiver.id = $2
    AND listings.id = $3;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const addListing = function(listing) {
  let queryParams = [listing.owner_id, listing.title, listing.description, listing.photo_1, listing.photo_2, listing.photo_3, listing.photo_4, listing.price];

  let queryString = `
    INSERT INTO listings (owner_id, title, description, photo_1, photo_2,  photo_3, photo_4, price) VALUES ('$1, $2, $3, $4, $5, $6, $7, $8');
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error)
    })
};

const addFavourite = function(favourite) {
  let queryParams = [favourite.user_id, favourite.listing_id];
  let queryString = `
    INSERT INTO user_favourites (user_id, listing_id) VALUES ($1, $2);
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    })
};

const createMessage = function(message) {
  let queryParams = [message.sender, message.receiver, message.listing, message.text];
  let queryString = `
    INSERT INTO user_messages (sender, receiver, listing, message) VALUES ('$1, $2, $3, $4');
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    })
};

const editSoldStatus = function(listing) {
  const queryParams = [listing.sold_status];
  let queryString = `
    UPDATE listings
    SET sold_status = TRUE
    WHERE listings.id = $1;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    })
};

const deleteListing = function(listing) {
  const queryParams = [listing.id];
  let queryString = `
    DELETE FROM listings
    WHERE listings.id = $1;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    })
};

const deleteFavourite = function(favourite) {
  const queryParams = [favourite.id];
  let queryString = `
    DELETE FROM user_favourites
    WHERE user_favourites.id = $1;
    `;

  return db.query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    })
};


module.exports = {
  getUsers,
  getAllItems,
  getFeaturedItems,
  getUserFavorites,
  getUserMessages,
  getAdminListings,
  getConversation,
  addListing,
  addFavourite,
  createMessage,
  editSoldStatus,
  deleteListing,
  deleteFavourite
 };


