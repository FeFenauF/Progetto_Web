const express = require('express');
const carsDao = require("../models/carsDao");
const cardsDao = require("../models/cardsDao");
const router = express.Router();

router.get('/home', function (req, res){
    if (req.isAuthenticated()) {
        if(req.user.ruolo==="Utente"){
            res.render('home', {user: req.user});
        } else {
            res.redirect('/admin/home');
        }
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", link: '/login'});
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
                res.render('error', {message: "Errore recupero dati dei preferiti!", error: err, link: '../home'});
            });

    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", link: '/login'});
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
                res.render('error', {message: "Errore recupero dati carrello!", error: err, link: '../home'});
            });

    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", link: '/login'});
    }
});

router.get('/carte', (req, res) => {
    if (req.isAuthenticated()){
        console.log(req.user.id);
        cardsDao.getAllCards(req.user.id)
            .then(({hasCards, cards}) => {
                console.log(cards);
                console.log(hasCards);
                res.render('carte', { hasCards, cards });
            })
            .catch(() => {
                res.render('error', {message: "Errore recupero dati delle carte!", link: '/user/home'});
            });

    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", link: '/login'});
    }
});

router.get('/carteform', function (req, res){
    if (req.isAuthenticated()) {
        res.render('carteform', {user: req.user});
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", link: '/login'});
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
                res.render('error', {message: "Errore recupero dati degli ordini!", error: err, link: '../home'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", link: '/login'});
    }
});




module.exports = router;