const { response } = require("express");
const { user } = require("pg/lib/defaults");
const users = require("../../routes/users");
const db = require("../connection");

const getUsers = () => {
  return db.query("SELECT * FROM users;").then((data) => {
    return data.rows;
  });
};

const getAllItems = function (
  limit = 6,
  options = { min_price: null, max_price: null }
) {
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

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getFeaturedItems = function () {
  let queryString = `
    SELECT listings.*
    FROM listings
    WHERE featured_status = true;
    `;

  return db
    .query(queryString)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserFavourites = function (userId) {
  const queryParams = [userId];
  let queryString = `
    SELECT listings.*
    FROM listings
    JOIN user_favourites ON user_favourites.listing_id = listings.id
    WHERE user_favourites.user_id = $1;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserMessages = function (userId) {
  const queryParams = [userId];
  let queryString = `
    SELECT user_messages.message, sender.name, listings.title, sender.id AS sender_id, receiver.id AS receiver_id
    FROM user_messages
    JOIN users AS sender ON user_messages.sender = sender.id
    JOIN users AS receiver ON user_messages.receiver = receiver.id
    JOIN listings ON user_messages.listing = listings.id
    WHERE sender.id = $1
    GROUP BY listings.title, sender.name, user_messages.message, sender.id, receiver.id;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getAdminListings = function (userId) {
  const queryParams = [userId];
  let queryString = `
    SELECT listings.*
    FROM listings
    JOIN users on listings.owner_id = users.id
    WHERE users.id = $1;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getConversation = function (senderId, receiverId, listingId) {
  const queryParams = [senderId, receiverId, listingId];
  let queryString = `
    SELECT user_messages.message, sender.name, receiver.name, listings.title
    FROM user_messages
    JOIN users AS sender ON user_messages.sender = sender.id
    JOIN users AS receiver ON user_messages.receiver = receiver.id
    JOIN listings ON user_messages.listing = listings.id
    WHERE (sender.id = $1 AND receiver.id = $2)
    OR (sender.id = $2 AND receiver.id = $1)
    AND listings.id = $3
    ORDER BY user_messages.time_sent DESC;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const addListing = function(listing) {
  let queryParams = [listing.owner_id, listing.title, listing.description, listing.photo_1, listing.price];

  let queryString = `
    INSERT INTO listings (owner_id, title, description, photo_1, price) VALUES ('$1, $2, $3, $4, $5');
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const addFavourite = function (favourite) {
  let queryParams = [favourite.user_id, favourite.listing_id];
  let queryString = `
    INSERT INTO user_favourites (user_id, listing_id) VALUES ($1, $2);
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const createMessage = function (message) {
  let queryParams = [
    message.sender,
    message.receiver,
    message.listing,
    message.text,
  ];
  let queryString = `
    INSERT INTO user_messages (sender, receiver, listing, message) VALUES ($1, $2, $3, $4);
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const editSoldStatus = function (listing) {
  const queryParams = [listing.sold_status];
  let queryString = `
    UPDATE listings
    SET sold_status = TRUE
    WHERE listings.id = $1;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteListing = function (listing) {
  const queryParams = [listing.id];
  let queryString = `
    DELETE FROM listings
    WHERE listings.id = $1;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteFavourite = function (favourite) {
  const queryParams = [favourite.id];
  let queryString = `
    DELETE FROM user_favourites
    WHERE user_favourites.id = $1;
    `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getItemById = function (item) {
  const queryParams = [item.id];
  let queryString = `
    SELECT listings.*
    FROM listings
    WHERE listings.id = $1
    ;`;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

const editItem = function (id, options) {
  const queryParams = [];
  let queryString = `
    UPDATE listings
    SET
    `;

  if (options.title) {
    queryParams.push(options.title);
    queryString += `title = $${queryParams.length}, `;
  }

  if (options.description) {
    queryParams.push(options.description);
    queryString += `description = $${queryParams.length}, `;
  }

  if (options.photo_1) {
    queryParams.push(option.photo_1);
    queryString += `photo_1 = $${queryParams.length}, `;
  }

  if (options.price) {
    queryParams.push(options.price);
    queryString += `price = $${queryParams.length}, `;
  }

  if (options.sold_status) {
    queryParams.push(options.sold_status);
    queryString += `sold_status = $${queryParams.length}, `;
  }

  queryParams.push(id);
  queryString =
    queryString.slice(0, -2) +
    `
    WHERE id = $${queryParams.length}
  `;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getUsers,
  getAllItems,
  getFeaturedItems,
  getUserFavourites,
  getUserMessages,
  getAdminListings,
  getConversation,
  addListing,
  addFavourite,
  createMessage,
  editSoldStatus,
  deleteListing,
  deleteFavourite,
  getItemById,
  editItem,
};
