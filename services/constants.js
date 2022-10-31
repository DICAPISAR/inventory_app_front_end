const constants = new Map();
constants.set('baseUrl', 'http://www.dicapisar.com/app_inventory')
constants.set('timeout', 60000)
constants.set('urlSession', 'http://localhost:8080')
constants.set('urlCore', 'http://localhost:8082')

function getConstant(key) {
    let value = constants.get(key)
    return value
}

module.exports = getConstant;