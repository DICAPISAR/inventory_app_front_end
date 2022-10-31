const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils')

/* GET home page. */
router.get('/', (req, res, next) => {
  let isSessionValidate = sessionUtils.validateSession(req);
  if (isSessionValidate) {
    res.render('index', { title: 'Inventory App', isWithInterface: true });
    return;
  }
  res.redirect('/login');
});

module.exports = router;
