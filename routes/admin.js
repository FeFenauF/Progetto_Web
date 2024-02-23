const express = require('express');
const router = express.Router();
const carsDao = require('../models/carsDao');

router.get('/home', function (req, res){
    if (req.isAuthenticated()) {
        res.render('adminhome', {user: req.user});
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
    }
});

router.get('/carform', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('adminnewcar');
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso come admin!", link: '/login'});
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
                    res.render('error', {message: "Errore durante il salvataggio del file!", error: err, link: '/admin/home'});
                }
            });
            res.redirect('../home');
        })
        .catch((err) => {
            res.render('error', {message: "Errore durante l'aggiunta del prodotto!", error: err, link: '/admin/home'});
        });
});

module.exports = router;