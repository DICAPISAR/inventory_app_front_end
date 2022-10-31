const express = require('express');
const router = express.Router();
const loginService = require('../services/login')
const SessionUtils = require('./sessionUtils')

/* GET login page. */
router.get('/', (req, res, next) => {
    res.render('login', { title: 'Inventory App', isWithInterface: false });
});

/* POST login page. */
router.post('/', async (req, res, next) => {

    let { userName, password } = req.body;

    console.log('userName ', userName);
    console.log('password ', password);

    let isLogin = await loginService.login(userName, password)

    if (isLogin.isLogin) {
        res.cookie('SESSION', SessionUtils.getCookie(isLogin.sessionCookie, 'SESSION'))
        res.redirect('/')
        return;
    }

    res.redirect('/login');

});

module.exports = router;
