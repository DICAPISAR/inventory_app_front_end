const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils')
const brandService = require('../services/brand')
const SessionUtils = require("./sessionUtils");

/* GET brand create page. */
router.get('/create', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    res.render('brand_create', { title: 'Inventory App', isWithInterface: true });
});

/* POST brand create page. */
router.post('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let { brandName } = req.body;
    let sessionId = req.cookies.SESSION;

    let brandCreationResponse = await brandService.createNewBrand(brandName, sessionId);

    if (brandCreationResponse.isForbidden) {
        res.redirect('/logout/do')
        return;
    }

    if (brandCreationResponse.isBrandCreated) {
        res.redirect('/brand/consult');
        return;
    }

    res.redirect('/brand/create')

});

/* GET brand consult page. */
router.get('/consult', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let brandGetListResponse = await brandService.getBrandList(sessionId);

    if (brandGetListResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let brandList =  normalizeBrandList(brandGetListResponse.brandList);

    res.render('brand_consult', { title: 'Inventory App', isWithInterface: true, brandList: brandList});
});

/* GET brand edit page. */
router.get('/:brandId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let brandId = req.params.brandId;

    let brandGetResponse = await brandService.getBrandById(brandId, sessionId);

    if (brandGetResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let brand = brandGetResponse.brand;

    res.render('brand_edit', { title: 'Inventory App', isWithInterface: true, brand: brand});
});

/* Post brand edit page. */
router.post('/:brandId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;
    let brandId = req.params.brandId;
    let { brandName } = req.body;


    let brandUpdateResponse = await brandService.updateBrandById(brandId, brandName, sessionId);

    if (brandUpdateResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let brand = brandUpdateResponse.brand;

    res.render('brand_edit', { title: 'Inventory App', isWithInterface: true, brand: brand});
});

function normalizeBrandList(brandList) {
    brandList.forEach(brand => {
        brand.creationDate = getDateWithFormat(brand.creationDate);
        brand.updateDate = getDateWithFormat(brand.updateDate);
    })
    return brandList;
}

function getDateWithFormat(date) {
    let newDate = date.split("T");
    return newDate[0];
}

module.exports = router;