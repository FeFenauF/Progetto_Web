const express = require('express');
const router = express.Router();
const carsDao = require('../models/carsDao');

router.get('/home', function (req, res){
    if (req.isAuthenticated()) {
        res.render('adminhome', {user: req.user});
    } else {
        res.redirect('/login');
    }
});

router.get('/carform', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('adminnewcar');
    } else {
        res.redirect('/login');
    }
})

router.post('/newcar', (req, res) => {
    var car = req.body;
    var file = req.files.image;

    if (!file) {
        return res.status(400).send("Nessun file caricato.");
    }

    var filename = file.name;
    car.image = filename;

    console.log(req.body);
    carsDao.newCar(car)
        .then(() => {
            console
            const destinationPath = `public/images/`;

            file.mv(`${destinationPath}${filename}`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Errore durante il salvataggio del file.");
                }
            });
            res.redirect('../home');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Errore durante l'aggiunta del prodotto.");
        });
});

module.exports = router;