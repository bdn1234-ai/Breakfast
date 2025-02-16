const User = require('../models/users');

module.exports.renderUserForm = (req, res) => {
    res.render('users/register');
}

module.exports.createAccount = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    res.redirect('/');
}

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
}