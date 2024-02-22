const express = require('express');
const router = express.Router();
const cardsDao = require("../models/cardsDao");

router.post('/carte/add', (req, res) => {
    if (req.isAuthenticated()){
        console.log(req.body);
        cardsDao.addCard(req.body, req.user.id)
            .then((card) => {
                console.log(card);
                res.redirect('../../../user/carte');
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Errore aggiunta carta');
            });

    } else {
        res.redirect('/login');
    }
});

router.get('/carte/remove/:cardid', (req, res) => {
    if(req.isAuthenticated()){
        cardsDao.removeCard(req.user.id, req.params.cardid)
            .then(() => {
                res.redirect('../../../user/carte');
            })
            .catch(() => {
                res.redirect('/user/home');
            });
    } else {
        res.redirect('/login');
    }
});


module.exports = router;