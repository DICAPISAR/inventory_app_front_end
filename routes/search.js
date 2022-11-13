const express = require('express');
const router = express.Router();
const searchService = require('../services/search')
const sessionUtils = require('./sessionUtils')

/* GET search page. */
router.post('/', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
        return;
    }

    let { search } = req.body;
    let sessionId = req.cookies.SESSION;

    let resultResponse = await searchService.getResults(search, sessionId);

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);


    res.render('result',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile,
            resultResponse: resultResponse.resultData,
            resultValue: search
        }
    );
});

module.exports = router;