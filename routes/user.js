const express = require('express');
const carsDao = require("../models/carsDao");
const cardsDao = require("../models/cardsDao");
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
                res.status(500).send('Errore recupero dati carrello');
            });

    } else {
        res.redirect('/login');
    }
});

router.get('/carte', (req, res) => {
    if (req.isAuthenticated()){
        console.log(req.user.id);
        cardsDao.getAllCards(req.user.id)
            .then(({hasCards, cards}) => {
                console.log(cards);
                res.render('carte', {cards});
            })
            .catch((err) => {
                console.error(err);
                res.render('carte', cards);
            });

    } else {
        res.redirect('/login');
    }
});

router.get('/carteform', function (req, res){
    if (req.isAuthenticated()) {
        res.render('carteform', {user: req.user});
    } else {
        res.redirect('/login');
    }
});

router.get('/orders', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.getOrders(req.user.id)
            .then((orders) => {
                console.log(orders);
                res.render('orders', {orders});
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore recupero dati degli ordini');
            });
    } else {
        res.redirect('/login');
    }
});




module.exports = router;