const dotenv = require('dotenv');
dotenv.config();

const constants = new Map();
constants.set('baseUrl', process.env.URL_BACK_END);
constants.set('timeout', process.env.TIMEOUT_API_REST);


function getConstant(key) {
    return constants.get(key);
}

module.exports = getConstant;