/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/queries/users');

// router.get('/', (req, res) => {
//   res.render('users');
// });


module.exports = (db) => {
  router.get('/', (req, res) => {
    const result = db.query('SELECT * FROM users;')
    console.log(result, 'RESULT')
    console.log('userroutes')
    res.render('users');
  })
  return router;
}


module.exports = router;
