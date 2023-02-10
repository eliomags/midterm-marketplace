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
  userId,
  limit = 6,
  options = { min_price: null, max_price: null }
) {
  const queryParams = [userId];
  let queryString = `
    SELECT listings.*,
           COALESCE(user_favourites.user_id, 0) as favourite_status
    FROM listings
    LEFT JOIN user_favourites
      ON user_favourites.listing_id = listings.id
      AND user_favourites.user_id = $1
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
  WITH subquery AS (
    SELECT user_messages.listing, MIN(user_messages.sender) AS sender, MAX(user_messages.receiver) AS receiver, COUNT(*) as message_count
    FROM user_messages
    WHERE user_messages.sender = $1 OR user_messages.receiver = $1
    GROUP BY user_messages.listing, (CASE
      WHEN user_messages.sender < user_messages.receiver THEN concat(user_messages.sender::text, '', user_messages.receiver::text)
      ELSE concat(user_messages.receiver::text, '', user_messages.sender::text)
    END)
  )
  SELECT subquery.listing, subquery.sender, subquery.receiver, subquery.message_count, listings.title, sender_users.name as sender_name, receiver_users.name as receiver_name
  FROM subquery
  JOIN listings ON subquery.listing = listings.id
  JOIN users as sender_users ON subquery.sender = sender_users.id
  JOIN users as receiver_users ON subquery.receiver = receiver_users.id;

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
    WHERE users.id = $1
    ORDER BY listings.id;

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

const addListing = function (listing) {
  let queryParams = [
    listing.owner_id,
    listing.title,
    listing.description,
    listing.photo_1,
    listing.price,
  ];

  let queryString = `
    INSERT INTO listings (owner_id, title, description, photo_1, price) VALUES ($1, $2, $3, $4, $5);
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
  let string = `SELECT * FROM user_favourites WHERE user_id = $1 AND listing_id = $2;`;
  return db
    .query(string, queryParams)
    .then((response) => {
      if (response.rows.length === 0) {
        let queryString = `
        INSERT INTO user_favourites (user_id, listing_id) VALUES ($1, $2);
        `;
        return db.query(queryString, queryParams);
      }
    })
    .then((response2) => {
      console.log(response2);
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
const updateSoldStatus = function (listing) {
  const queryParams = [listing.id,!listing.sold_status];
  let queryString = `
    UPDATE listings
    SET sold_status = $2
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
  const queryParams = [favourite.listing_id, favourite.user_id];
  console.log(queryParams);
  let queryString = `
    DELETE FROM user_favourites
    WHERE user_favourites.listing_id = $1 AND user_favourites.user_id=$2;
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
  updateSoldStatus
};
