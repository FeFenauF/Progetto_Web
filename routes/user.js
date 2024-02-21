const express = require('express');
const carsDao = require("../models/carsDao");
const router = express.Router();

router.get('/home', function (req, res){
    if (req.isAuthenticated()) {
        res.render('home', {user: req.user});
    } else {
        res.redirect('/login');
    }
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

router.get('/cart', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.getCart(req.user.id)
            .then((cars) => {
                console.log(cars);
                res.render('cart', {cars});
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore recupero dati dei preferiti');
            });

    } else {
        res.redirect('/login');
    }
});

router.get('/paymethods', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.getAllCards(req.user.id)
            .then((cards) => {
                console.log(cards);
                res.render('payments', {cards});
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore nessuna carta');
            });

    } else {
        res.redirect('/login');
    }
});


router.get('/paymethods/add', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.addCard(req.body, req.user.id)
            .then((card) => {
                console.log(card);
                res.render('../', {card});
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore aggiunta carta');
            });

    } else {
        res.redirect('/login');
    }
});

module.exports = router;