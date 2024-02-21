exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

exports.isAdmin = (req, res, next) => {
    if (req.user.role === 'Admin')
        res.redirect('/admin/dashboard');
    else
        res.render('AdminFail');
}