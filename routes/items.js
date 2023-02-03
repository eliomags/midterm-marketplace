const express = require('express');
const router  = express.Router();
const { getAllItems } = require('../db/queries/users')


router.get('/', (req, res) => {
  getAllItems(4)
  .then((items) => {
    res.json(items);
  })

});

module.exports = router;
