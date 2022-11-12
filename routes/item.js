const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const itemService = require('../services/item');
const brandService = require('../services/brand');
const typeItemService = require('../services/type_item');

/* GET item create page. */
router.get('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }

    let sessionId = req.cookies.SESSION;

    let responseBrandList = await brandService.getBrandList(sessionId);
    let responseTypeItemList = await typeItemService.getTypeItemList(sessionId);

    if (responseBrandList.isForbidden || responseTypeItemList.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('item_create',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile,
            brandList: responseBrandList.brandList,
            typeItemList: responseTypeItemList.typeItemList
        }
    );
});

/* POST item create page. */
router.post('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let { name, price, typeItemId, brandId } = req.body;
    let sessionId = req.cookies.SESSION;

    let itemCreationResponse = await itemService.createNewItem(name, price, brandId, typeItemId, sessionId);

    if (itemCreationResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (!itemCreationResponse.isItemCreated || itemCreationResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    res.redirect('/item/consult');

});

/* GET item consult page. */
router.get('/consult', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let itemGetListResponse = await itemService.getItemList(sessionId);

    if (itemGetListResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (itemGetListResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let itemList =  normalizeDates(itemGetListResponse.itemList);
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);


    res.render('item_consult',
        {
            title: 'Inventory App',
            isWithInterface: true,
            itemList: itemList,
            infoProfile: infoProfile
        }
    );
});

/* GET item edit page. */
router.get('/:itemId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let itemId = req.params.itemId;

    let itemGetResponse = await itemService.getItemById(itemId, sessionId);

    if (itemGetResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (itemGetResponse.error !== null) {
        res.redirect('/error/not_found');
        return;
    }

    let item = itemGetResponse.item;
    let responseBrandList = await brandService.getBrandList(sessionId);
    let responseTypeItemList = await typeItemService.getTypeItemList(sessionId);
    let brandId = item.brand;
    let typeItemId = item.typeItem;

    if (responseBrandList.isForbidden || responseTypeItemList.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('item_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            item: item,
            infoProfile: infoProfile,
            brandList: responseBrandList.brandList,
            typeItemList: responseTypeItemList.typeItemList,
            brandId: brandId,
            typeItemId: typeItemId
        },
    );
});

/* Post item edit page. */
router.post('/:itemId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let itemId = req.params.itemId;
    let { name, price, typeItemId, brandId } = req.body;

    let itemUpdateResponse = await itemService.updateItemById(itemId, name, price, brandId, typeItemId, sessionId);

    if (itemUpdateResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (itemUpdateResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let responseBrandList = await brandService.getBrandList(sessionId);
    let responseTypeItemList = await typeItemService.getTypeItemList(sessionId);

    if (responseBrandList.isForbidden || responseTypeItemList.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let item = itemUpdateResponse.item;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('item_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            item: item,
            infoProfile: infoProfile,
            brandList: responseBrandList.brandList,
            typeItemList: responseTypeItemList.typeItemList,
            brandId: item.brand,
            typeItemId: item.typeItem
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