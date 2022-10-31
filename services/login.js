const apiCallService = require('./apiCall')
const getConstants = require("./constants");

exports.login = async (userName, password) => {
    let data = {
        'name': userName,
        'password': password
    }
    let response = await apiCallService.post(getConstants('urlSession') + '/login', data, null)
    if (response.getDataError !== null) {
        return {
            'isLogin': false,
            'cookie': null
        }
    }
    return {
        'isLogin': response.getDataResponse.status === 200,
        'cookie': response.getDataResponse.headers["set-cookie"]
    }
}