const express = require('express');
const router = express.Router();
const carsDao = require('../models/carsDao');
const usersDao = require('../models/usersDao');

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

router.get('/operations', function (req, res){
    if (req.isAuthenticated()) {
        res.render('adminoperations', {user: req.user});
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso!", error: "Accesso non effettuato", link: '/login'});
    }
});

router.get('/adminform', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('newadmin');
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso come admin!", link: '/login'});
    }
})

router.get('/removecar', (req, res) => {
    if (req.isAuthenticated()) {
        carsDao.getAllCars()
            .then((cars) => {
                res.render('showremovable', {cars});
            })
            .catch((err) => {
                res.render('error', {message: "Errore recupero dati delle auto!", error: err, link: '/user/home'});
            });
    } else {
        res.render('error', {message: "Devi prima effettuare l'accesso come admin!", link: '/login'});
    }
})


module.exports = router;