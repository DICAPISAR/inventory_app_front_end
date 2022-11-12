const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const typeItemService = require('../services/type_item');

/* GET type item create page. */
router.get('/create', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('type_item_create',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile
        }
    );
});

/* POST type item create page. */
router.post('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let { typeItemName, isPerishable } = req.body;
    let sessionId = req.cookies.SESSION;

    let typeItemCreationResponse = await typeItemService.createNewTypeItem(typeItemName, isPerishable !== undefined, sessionId);

    if (typeItemCreationResponse.isForbidden) {
        res.redirect('/logout/do')
        return;
    }

    if (typeItemCreationResponse.isTypeItemCreated) {
        res.redirect('/type_item/consult');
        return;
    }

    res.redirect('/type_item/create');

});

/* GET type item consult page. */
router.get('/consult', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let typeItemGetListResponse = await typeItemService.getTypeItemList(sessionId);

    if (typeItemGetListResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let typeItemList =  normalizeTypeItemList(typeItemGetListResponse.typeItemList);
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('type_item_consult',
        {
            title: 'Inventory App',
            isWithInterface: true,
            typeItemList: typeItemList,
            infoProfile: infoProfile
        }
    );
});

/* GET type item edit page. */
router.get('/:typeItemId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let typeItemId = req.params.typeItemId;

    let typeItemGetResponse = await typeItemService.getTypeItemById(typeItemId, sessionId);

    if (typeItemGetResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let typeItem = typeItemGetResponse.typeItem;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('type_item_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            typeItem: typeItem,
            infoProfile: infoProfile
        },
    );
});

/* Post type item edit page. */
router.post('/:typeItemId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let typeItemId = req.params.typeItemId;
    let { typeItemName, isPerishable } = req.body;

    let typeItemUpdateResponse = await typeItemService.updateTypeItemById(typeItemId, typeItemName, isPerishable !== undefined, sessionId);

    if (typeItemUpdateResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let typeItem = typeItemUpdateResponse.typeItem;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('type_item_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            typeItem: typeItem,
            infoProfile: infoProfile
        }
    );
});

function normalizeTypeItemList(typeItemList) {
    if (typeItemList === null) {
        return null
    }
    typeItemList.forEach(brand => {
        brand.creationDate = getDateWithFormat(brand.creationDate);
        brand.updateDate = getDateWithFormat(brand.updateDate);
    })
    return typeItemList;
}

function getDateWithFormat(date) {
    let newDate = date.split("T");
    return newDate[0];
}

module.exports = router;