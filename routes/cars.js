const express = require('express');
const router = express.Router();
const carsDao = require('../models/carsDao');
const cardsDao = require('../models/cardsDao');


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

router.get('/checkout', (req, res) => {
    if(req.isAuthenticated()) {
        cardsDao.getAllCards(req.user.id)
            .then(({hasCards, cards}) => {
                if (hasCards) {
                    console.log(cards);
                    res.render('checkout', {cards});
                } else {
                    res.redirect('/user/carteform');
                }
            })
            .catch(() => {
                res.redirect('/user/carteform');
            });
    } else {
        res.redirect('/login');
    }
});

router.post('/checkout', (req, res) => {
    if(req.isAuthenticated()) {
        console.log(req.body.card);
        carsDao.getCart(req.user.id)
            .then((cars) => {
                carsDao.performCheckout(cars)
                    .then((orderedCars) => {
                        carsDao.addOrder(req.user.id, orderedCars, req.body.card)
                            .then(() => {
                                carsDao.removeAllFromCart(req.user.id)
                                    .then(() => {
                                        res.redirect('../../../user/orders');
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        res.status(500).send('Errore svuotamento carrello');
                                    })
                            })
                            .catch((err) => {
                                console.error(err);
                                res.status(500).send('Errore aggiunta ordine');
                            })
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send('Errore nel checkout');
                    })
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore recupero dati del carrello');
            })
    } else {
        res.redirect('/login');
    }
})


module.exports = router;