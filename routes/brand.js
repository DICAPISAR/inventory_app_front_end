const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const brandService = require('../services/brand');

/* GET brand create page. */
router.get('/create', (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('brand_create',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile
        }
    );
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

    if (brandCreationResponse.error !== null || !brandCreationResponse.isBrandCreated) {
        res.redirect('/error/internal_server_error');
        return;
    }

    res.redirect('/brand/consult');

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

    if (brandGetListResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let brandList =  normalizeBrandList(brandGetListResponse.brandList);
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('brand_consult',
        {
            title: 'Inventory App',
            isWithInterface: true,
            brandList: brandList,
            infoProfile: infoProfile
        }
    );
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

    if (brandGetResponse.error !== null) {
        res.redirect('/error/not_found');
        return;
    }

    let brand = brandGetResponse.brand;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('brand_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            brand: brand,
            infoProfile: infoProfile
        }
    );
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

    if (brandUpdateResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let brand = brandUpdateResponse.brand;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('brand_edit',
        {
            title: 'Inventory App',
            isWithInterface: true,
            brand: brand,
            infoProfile: infoProfile
        }
    );
});

function normalizeBrandList(brandList) {
    if (brandList === null) {
        return null
    }
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