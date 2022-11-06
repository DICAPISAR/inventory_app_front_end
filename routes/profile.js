const express = require('express');
const router = express.Router();
const fs = require('fs')
const sessionUtils = require('./sessionUtils');
const passwordService = require('../services/password');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/profile/images' })

/* GET profile page. */
router.get('/', (req, res, next) => {
    let isSessionValidate = sessionUtils.validateSession(req);
    if (!isSessionValidate) {
        res.redirect('/login');
        return;
    }

    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    res.render('profile',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile
        }
    );
});


/* POST update password . */
router.post('/change_password', async (req, res, next) => {
    let isSessionValidate = sessionUtils.validateSession(req);
    if (!isSessionValidate) {
        res.redirect('/login');
        return;
    }

    let { newPassword } = req.body;
    let sessionId = req.cookies.SESSION;

    let changePasswordResponse = await passwordService.changePassword(newPassword, sessionId);

    if (changePasswordResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    if (changePasswordResponse.error !== null || !changePasswordResponse.isChangePassword) {
        res.redirect('/error/internal_server_error')
        return;
    }

    res.redirect('/profile');
});

/* POST update password . */
router.post('/change_photo', upload.single('newPhoto'), async (req, res, next) => {
    let isSessionValidate = sessionUtils.validateSession(req);
    if (!isSessionValidate) {
        res.redirect('/login');
        return;
    }

    let newPhoto = req.file;
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    let savePhoto = await saveNewPhoto(newPhoto, infoProfile.id);

    if (savePhoto.hasError !== null) {
        res.redirect('/error/internal_server_error');
    }

    res.redirect('/profile');
});


const saveNewPhoto = async (newPhotoData, userId) => {
    let pathNewPhoto = newPhotoData.path;
    let hasError = null;

    await fs.renameSync(pathNewPhoto, `./public/images/profile/${userId}.png`, (err) => {
        if (err) {
            hasError = err;
        }
    })

    return {
        'hasError': hasError
    }
}

module.exports = router;