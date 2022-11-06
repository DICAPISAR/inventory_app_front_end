const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const providerService = require('../services/provider');
const contactService = require('../services/contacts');

/* GET provider create page. */
router.get('/create', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('provider_create',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile
        }
    );
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
        res.redirect('/logout/do');
        return;
    }

    if (!providerCreationResponse.isProviderCreated || providerCreationResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    res.redirect('/provider/consult');

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

    if (providerGetListResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let providerList =  normalizeDates(providerGetListResponse.providerList);
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('provider_consult',
        {
            title: 'Inventory App',
            isWithInterface: true,
            providerList: providerList,
            infoProfile: infoProfile
        }
    );
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

    if (providerGetResponse.error !== null) {
        res.redirect('/error/not_found');
        return;
    }

    let contactGetListResponse = await contactService.getContactListByProviderId(providerId, sessionId);

    let provider = providerGetResponse.provider;
    let contactList = normalizeDates(contactGetListResponse.contactsList);
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('provider_edit',
        { title: 'Inventory App',
            isWithInterface: true,
            provider: provider,
            contactList: contactList,
            infoProfile: infoProfile
        }
    );
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

    if (providerUpdateResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let provider = providerUpdateResponse.provider;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('provider_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            provider: provider,
            infoProfile: infoProfile
        }
    );
});

/* GET contact create by provider page. */
router.get('/:providerId/create_new_contact', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }

    let providerId = req.params.providerId;
    let sessionId = req.cookies.SESSION;

    let getProviderResponse = await providerService.getProviderById(providerId, sessionId);

    if (getProviderResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (getProviderResponse.error !== null) {
        res.redirect('/error/not_found')
    }

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('contact_create',
        {
            title: 'Inventory App',
            isWithInterface: true,
            providerId: providerId,
            infoProfile: infoProfile
        }
    );
});

/* POST contact create by provider page. */
router.post('/:providerId/create_new_contact', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }

    let providerId = req.params.providerId;
    let sessionId = req.cookies.SESSION;

    let getProviderResponse = await providerService.getProviderById(providerId, sessionId);

    if (getProviderResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (getProviderResponse.error !== null) {
        res.redirect('/error/not_found')
    }

    let { name, phoneNumber, email } = req.body;

    let createNewContactResponse = await contactService.createNewContactByProviderId(providerId, name, phoneNumber, email, sessionId);

    if (createNewContactResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (!createNewContactResponse.isContactCreated || createNewContactResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    res.redirect('/provider/' + providerId);
});


/* GET contact by provider page. */
router.get('/:providerId/contact/:contactId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let providerId = req.params.providerId;
    let getProviderResponse = await providerService.getProviderById(providerId, sessionId);
    if (getProviderResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }
    if (getProviderResponse.error !== null) {
        res.redirect('/error/not_found')
    }

    let contactId = req.params.contactId;
    let getContactResponse = await contactService.getContactByIdAndProviderId(providerId, contactId, sessionId);
    if (getContactResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }
    if (getContactResponse.error !== null) {
        res.redirect('/error/not_found')
    }

    let contact = getContactResponse.contact
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('contact_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            providerId: providerId,
            contactId: contactId,
            contact: contact ,
            infoProfile: infoProfile
        }
    );
});

/* Post update contact by provider page. */
router.post('/:providerId/contact/:contactId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let providerId = req.params.providerId;
    let getProviderResponse = await providerService.getProviderById(providerId, sessionId);
    if (getProviderResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }
    if (getProviderResponse.error !== null) {
        res.redirect('/error/not_found')
    }

    let { name, phoneNumber, email } = req.body;

    let contactId = req.params.contactId;
    let updateContactResponse = await contactService.updateContactByIdAndProviderId(providerId, contactId, name, phoneNumber, email, sessionId);
    if (updateContactResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }
    if (updateContactResponse.error !== null) {
        res.redirect('/error/internal_server_error')
    }
    let contact = updateContactResponse.contact;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('contact_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            providerId: providerId,
            contact: contact,
            infoProfile: infoProfile
        }
    );
});


function normalizeDates(dataList) {
    if (dataList === null || dataList === undefined) {
        return null
    }
    dataList.forEach(data => {
        data.creationDate = getDateWithFormat(data.creationDate);
        data.updateDate = getDateWithFormat(data.updateDate);
    })
    return dataList;
}

function getDateWithFormat(date) {
    let newDate = date.split("T");
    return newDate[0];
}

module.exports = router;