const express = require('express');
const router = express.Router();
const loginService = require('../services/login')
const SessionUtils = require('./sessionUtils')

/* GET login page. */
router.get('/', (req, res, next) => {
    let isLogin = SessionUtils.validateSession(req);
    if (isLogin) {
        res.redirect('/');
    }
    res.render('login', { title: 'Inventory App', isWithInterface: false });
});

/* POST login page. */
router.post('/', async (req, res, next) => {
    let { userName, password } = req.body;
    let loginResponse = await loginService.login(userName, password)
    if (loginResponse.isLogin) {
        res.cookie('SESSION', SessionUtils.getCookie(loginResponse.cookie, 'SESSION'));
        res.redirect('/');
        return;
    }
    res.redirect('/login');
});

module.exports = router;
