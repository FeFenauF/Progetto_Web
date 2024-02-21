const express = require('express');
const router = express.Router();
const carsDao = require('../models/carsDao');


router.get('/showroom', (req, res) => {
    carsDao.getAllCars()
        .then((cars) => {
            console.log(cars);
            res.render('showroom', {cars});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Errore recupero dati delle auto');
        });
});

router.get('/favourites/add/:carid', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.addFavourite(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/favourites');
            })
            .catch(() => {
                res.redirect('/user/home');
            });
    } else {
        res.redirect('/login');
    }
});

router.get('/favourites/remove/:carid', (req, res) => {
    if(req.isAuthenticated()){
        carsDao.removeFavourite(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/favourites');
            })
            .catch(() => {
                res.redirect('/user/home');
            });
    } else {
        res.redirect('/login');
    }
});

router.get('/details/:carid', (req, res) => {
    console.log(req.params.carid);
    carsDao.getCarById(req.params.carid)
        .then((car) => {
            res.render('details', {car});
        })
        .catch(() => {
            console.error(err);
            res.status(500).send('Errore recupero dati dell auto');
        });
});

router.get('/cart/add/:carid', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.addToCart(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/cart');
            })
            .catch(() => {
                res.redirect('/user/home');
            });
    } else {
        res.redirect('/login');
    }
});

router.get('/cart/remove/:carid', (req, res) => {
    if(req.isAuthenticated()){
        carsDao.removeCarFromCart(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/cart');
            })
            .catch(() => {
                res.redirect('/user/home');
            });
    } else {
        res.redirect('/login');
    }
});


module.exports = router;