const express = require('express');
const router = express.Router();
const logoutService = require('../services/logout')
const SessionUtils = require('./sessionUtils')

/* GET logout page. */
router.get('/', (req, res, next) => {
    let isLogin = SessionUtils.validateSession(req)
    if (isLogin) {
        res.redirect('/')
        return;
    }
    res.render('logout', { title: 'Inventory App', isWithInterface: false });
});

/* Get to do logout page. */
router.get('/do', async (req, res, next) => {
    let isLogin = SessionUtils.validateSession(req)
    if (!isLogin) {
        res.redirect('/')
        return;
    }
    let sessionId = req.cookies.SESSION;
    let logoutResponse = await logoutService.logout(sessionId);
    if (logoutResponse.isLogout) {
        res.clearCookie('SESSION');
        res.redirect('/logout');
        return;
    }

    res.redirect('/');

});

module.exports = router;
