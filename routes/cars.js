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


router.get('/favourites/add/:carid', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.addFavourite(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../');
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
                res.redirect('../');
            })
            .catch(() => {
                res.redirect('/user/home');
            });
    } else {
        res.redirect('/login');
    }
})


module.exports = router;