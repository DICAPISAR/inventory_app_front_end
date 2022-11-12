const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');

/* GET not found error page. */
router.get('/not_found', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/');
    }
    res.render('404',
        {
            title: 'Inventory App',
            isWithInterface: false
        }
    );
});

/* GET internal server error page. */
router.get('/internal_server_error', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/');
    }
    res.render('internal_server_error',
        {
            title: 'Inventory App',
            isWithInterface: false
        }
    );
});

module.exports = router;
