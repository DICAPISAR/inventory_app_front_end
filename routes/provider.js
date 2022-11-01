const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const providerService = require('../services/provider');

/* GET provider create page. */
router.get('/create', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    res.render('provider_create', { title: 'Inventory App', isWithInterface: true });
});

/* POST provider create page. */
router.post('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let { name, address, phoneNumber, documentNumber, email } = req.body;
    let sessionId = req.cookies.SESSION;

    let providerCreationResponse = await providerService.createNewProvider(name, address, phoneNumber, documentNumber, email, sessionId);

    if (providerCreationResponse.isForbidden) {
        res.redirect('/logout/do')
        return;
    }

    if (providerCreationResponse.isProviderCreated) {
        res.redirect('/provider/consult');
        return;
    }

    res.redirect('/provider/create');

});

/* GET provider consult page. */
router.get('/consult', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let providerGetListResponse = await providerService.getProviderList(sessionId);

    if (providerGetListResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let providerList =  normalizeProviderList(providerGetListResponse.providerList);

    res.render('provider_consult', { title: 'Inventory App', isWithInterface: true, providerList: providerList});
});

/* GET provider edit page. */
router.get('/:providerId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let providerId = req.params.providerId;

    let providerGetResponse = await providerService.getProviderById(providerId, sessionId);

    if (providerGetResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let provider = providerGetResponse.provider;

    res.render('provider_edit', { title: 'Inventory App', isWithInterface: true, provider: provider});
});

/* Post provider edit page. */
router.post('/:providerId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let providerId = req.params.providerId;
    let { name, address, phoneNumber, documentNumber, email } = req.body;

    let providerUpdateResponse = await providerService.updateProviderById(providerId, name, address, phoneNumber, documentNumber, email, sessionId);

    if (providerUpdateResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let provider = providerUpdateResponse.provider;

    res.render('provider_edit', { title: 'Inventory App', isWithInterface: true, provider: provider});
});

function normalizeProviderList(providerList) {
    if (providerList === null || providerList === undefined) {
        return null
    }
    providerList.forEach(brand => {
        brand.creationDate = getDateWithFormat(brand.creationDate);
        brand.updateDate = getDateWithFormat(brand.updateDate);
    })
    return providerList;
}

function getDateWithFormat(date) {
    let newDate = date.split("T");
    return newDate[0];
}

module.exports = router;