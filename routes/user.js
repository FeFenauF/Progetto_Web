const express = require('express');
const carsDao = require("../models/carsDao");
const router = express.Router();

router.get('/home', function (req, res){
    res.render('home', {user: req.user});
});

router.get('/favourites', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.getAllFavourites(req.user.id)
            .then((cars) => {
                console.log(cars);
                res.render('favourites', {cars});
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore recupero dati dei preferiti');
            });

    } else {
        res.redirect('/login');
    }
});

module.exports = router;