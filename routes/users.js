const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

var userDao = require('../models/usersDao');

router.post('/register', (req, res) => {
  const user = req.body;
  console.log(req.body);
  userDao.newUser(user)
      .then(() => {
        res.redirect('/login');
      })
      .catch((err) => {
        res.redirect('/users/register');
      })
})

module.exports = router;
