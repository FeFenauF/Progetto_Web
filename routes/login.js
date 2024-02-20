const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
    res.render('login');
})

router.post('/session', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.render('login', {'mex': info.message});
        }

        req.login(user, function(err) {
            if (err) { return next(err); }

            console.log(user.ruolo);
            if(user.ruolo==='Utente')
                res.render('home');
            else
                res.redirect('/admin/dashboard');
        });
    })(req, res, next);
});

router.delete('/session/current', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return res.status(503).json(err); }
    });
    res.end();
});

module.exports = router;