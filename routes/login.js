const express = require('express');
const router = express.Router();
const loginService = require('../services/login')
const sessionUtils = require('./sessionUtils')

/* GET login page. */
router.get('/', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (isLogin) {
        res.redirect('/');
    }
    res.render('login',
        {
            title: 'Inventory App',
            isWithInterface: false
        }
    );
});

/* POST login page. */
router.post('/', async (req, res, next) => {
    let { userName, password } = req.body;

    let loginResponse = await loginService.login(userName, password);

    if (loginResponse.error !== null || !loginResponse.isLogin) {
        res.redirect('/login');
        return;
    }

    let infoSession = loginResponse.loginData;
    let infoSessionEncrypt = sessionUtils.encryptJson(infoSession);

    res.cookie('SESSION', sessionUtils.getCookie(loginResponse.cookie, 'SESSION'));
    res.cookie('HERMES', infoSessionEncrypt)
    res.redirect('/');
});

module.exports = router;
