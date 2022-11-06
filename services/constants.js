const constants = new Map();
//constants.set('baseUrl', 'http://www.dicapisar.com/app_inventory');
constants.set('baseUrl', 'http://');
constants.set('timeout', 60000);


function getConstant(key) {
    let value = constants.get(key)
    return value
}

module.exports = getConstant;