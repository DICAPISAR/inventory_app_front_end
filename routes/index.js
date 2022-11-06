const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils')

/* GET home page. */
router.get('/', (req, res, next) => {
  let isSessionValidate = sessionUtils.validateSession(req);

  if (isSessionValidate) {
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);
    res.render('index',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile
        }
    );
    return;
  }
  res.redirect('/login');
});

module.exports = router;
