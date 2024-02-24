const express = require('express');
const router = express.Router();
const userDao = require('../models/usersDao');
const usersDao = require("../models/usersDao");

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

router.post('/adminregister', (req, res) => {
    if (req.isAuthenticated()) {
        usersDao.newAdmin(req.body)
            .then(() => {
                res.redirect('/admin/operations');
            })
            .catch((err) => {
                res.render('error', {message: "Errore durante l'aggiunta del prodotto!", error: err, link: '/admin/home'});
            })
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso come admin!", link: '/login'});
    }
})

module.exports = router;
