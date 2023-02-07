/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/users");

router.get("/", (req, res) => {
  userQueries
    .getUsers()
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// module.exports = (db) => {
//   router.get('/', (req, res) => {
//     // userQueries.getUsers()
//     //   .then(users => {
//     //     res.json({ users });
//     //   })
//     //   .catch(err => {
//     //     res
//     //       .status(500)
//     //       .json({ error: err.message });
//     //   });
//     console.log(db)
//     res.send('okay')
//   });
//   return router;
// }

// do this instead
router.post("/login/:id", (req, res) => {
  // // using encrypted cookies
  // req.session.user_id = req.params.id;

  // or using plain-text cookies
  res.cookie("user_id", req.params.id);

  // send the user somewhere
  res.redirect("/items");
console.log("hello")
});

router.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/items");
});
module.exports = router;
