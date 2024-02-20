const express = require('express');
const router = express.Router();

router.get('/home', function (req, res){
    res.render('home', {user: req.user});
});

module.exports = router;