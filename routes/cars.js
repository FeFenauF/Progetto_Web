const express = require('express');
const router = express.Router();
const carsDao = require('../models/carsDao');
const cardsDao = require('../models/cardsDao');


router.get('/showroom', (req, res) => {
    carsDao.getAllCars()
        .then((cars) => {
            res.render('showroom', {cars});
        })
        .catch((err) => {
            res.render('error', {message: "Errore recupero dati dello showroom!", error: err, link: '/user/home'});
        });
});

router.get('/favourites/add/:carid', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.addFavourite(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/favourites');
            })
            .catch((err) => {
                res.render('error', {message: "Errore aggiunta ai preferiti!", error: err, link: '/user/home'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
    }
});

router.get('/favourites/remove/:carid', (req, res) => {
    if(req.isAuthenticated()){
        carsDao.removeFavourite(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/favourites');
            })
            .catch((err) => {
                res.render('error', {message: "Errore rimozione preferito!", error: err, link: '/user/home'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
    }
});

router.get('/details/:carid', (req, res) => {
    console.log(req.params.carid);
    carsDao.getCarById(req.params.carid)
        .then((car) => {
            res.render('details', {car});
        })
        .catch((err) => {
            res.render('error', {message: "Errore recupero dati dell'auto!", error: err, link: '../showroom'});
        });
});

router.get('/cart/add/:carid', (req, res) => {
    if (req.isAuthenticated()){
        carsDao.addToCart(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/cart');
            })
            .catch((err) => {
                res.render('error', {message: "Errore aggiunta al carrello!", error: err, link: '/cars/showroom'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
    }
});

router.get('/cart/remove/:carid', (req, res) => {
    if(req.isAuthenticated()){
        carsDao.removeCarFromCart(req.user.id, req.params.carid)
            .then(() => {
                res.redirect('../../../user/cart');
            })
            .catch((err) => {
                res.render('error', {message: "Errore rimozione auto dal carrello!", error: err, link: '/user/home'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
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
                    res.render('error', {message: "Devi aggiungere un metodo di pagamento!", error: "No card", link: '/user/carteform'});
                }
            })
            .catch((err) => {
                res.render('error', {message: "Errore recupero dati carte!", error: err, link: '/user/home'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
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
                                        res.render('error', {message: "Errore svuotamento carrello!", error: err, link: '/user/home'});
                                    })
                            })
                            .catch((err) => {
                                res.render('error', {message: "Errore aggiunta ordine!", error: err, link: '/user/home'});
                            })
                    })
                    .catch((err) => {
                        res.render('error', {message: "Errore nel checkout!", error: err, link: '/user/home'});
                    })
            })
            .catch((err) => {
                res.render('error', {message: "Errore recupero dati del carrello!", error: err, link: '/user/home'});
            })
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
    }
})

router.post('/cerca', (req, res) => {
    carsDao.searchCars((req.body.cerca).toLowerCase())
        .then((cars) => {
            res.render('showroom', {cars, active:'Cars'});
        })
        .catch((err) => {
            res.render('error', {message: "Errore nella ricerca!", error: err, link: '/user/home'});
        })
})

module.exports = router;