const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const userService = require('../services/user');
const rolService = require('../services/rol');

/* GET user create page. */
router.get('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }

    let sessionId = req.cookies.SESSION;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    let rolListResponse = await rolService.getRolList(sessionId);

    if (rolListResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let rolList = rolListResponse.rolesListData;

    res.render('user_create',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile,
            rolList: rolList
        }
    );
});

/* POST user create page. */
router.post('/create', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let { name, rolId } = req.body;
    let sessionId = req.cookies.SESSION;

    let userCreationResponse = await userService.createNewUser(name, rolId, sessionId);

    if (userCreationResponse.isForbidden) {
        res.redirect('/logout/do')
        return;
    }

    if (userCreationResponse.error !== null || !userCreationResponse.isUserCreated) {
        res.redirect('/error/internal_server_error');
        return;
    }

    res.redirect('/user/consult');

});

/* GET user consult page. */
router.get('/consult', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let sessionId = req.cookies.SESSION;

    let userGetListResponse = await userService.getUserList(sessionId);

    if (userGetListResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (userGetListResponse.error !== null) {
        res.redirect('/error/internal_server_error');
        return;
    }

    let userList =  normalizeUserList(userGetListResponse.userListData);
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('user_consult',
        {
            title: 'Inventory App',
            isWithInterface: true,
            userList: userList,
            infoProfile: infoProfile
        }
    );
});

router.post('/change_password/:userId', async (req, res, next) => {
    let isLogin = sessionUtils.validateSession(req);
    if (!isLogin) {
        res.redirect('/login');
    }
    let userId = req.params.userId;
    let sessionId = req.cookies.SESSION;
    let { newPassword } = req.body;


    let changePasswordResponse = await userService.changePasswordToUserId(userId, newPassword, sessionId);

    if (changePasswordResponse.isForbidden) {
        res.redirect('/logout/do')
        return;
    }

    if (changePasswordResponse.error !== null || !changePasswordResponse.isChangePassword) {
        res.redirect('/error/internal_server_error');
        return;
    }

    res.redirect('/user/consult');

});


function normalizeUserList(brandList) {
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