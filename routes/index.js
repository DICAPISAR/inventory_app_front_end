const express = require('express');
const router = express.Router();
const sessionUtils = require('./sessionUtils');
const dashboardService = require('../services/dashboard');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let isSessionValidate = sessionUtils.validateSession(req);

  if (isSessionValidate) {
    let infoProfile = sessionUtils.decryptJson(req.cookies.HERMES);

    let sessionId = req.cookies.SESSION;

    let dashboardResponse = await dashboardService.getDashboardsInfo(sessionId);

    if (dashboardResponse.isForbidden) {
        res.redirect('/logout/do');
        return;
    }

    let dashboardInfo = getDashboardInfo(dashboardResponse);


    res.render('index',
        {
            title: 'Inventory App',
            isWithInterface: true,
            infoProfile: infoProfile,
            dashboardInfo: dashboardInfo,
            timeInfo: getTimeInfo()
        }
    );
    return;
  }
  res.redirect('/login');
});

function getDashboardInfo(dashboardResponse) {

    let dashboardInfo = {}
    let count = {};
    let bar = {};

    dashboardResponse.dashboardInfo.dashboards.forEach(dashboard => {

        switch (dashboard.type) {
            case 'count':
                count[dashboard.name] = dashboard.data.count;
                break;
            case 'bar':
                bar[dashboard.name] = dashboard.data;
                break;
        }
    })

    dashboardInfo.count = count;
    dashboardInfo.bar = bar;

    return dashboardInfo;
}

function getTimeInfo() {
    let date = new Date();
    let monthOne = 'Ene';
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let monthTwo = date.toLocaleDateString('es-ES', options).split(" ")[3].slice(0,3);
    let monthTwoCapitalize = monthTwo.charAt(0).toUpperCase() + monthTwo.slice(1);
    let year = date.getFullYear();

    return `${monthOne} - ${monthTwoCapitalize} ${year}`
}

module.exports = router;
