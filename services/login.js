const apiCallService = require('./apiCall')

exports.login = async (userName, password) => {
    let data = {
        'name': userName,
        'password': password
    }
    let response = await apiCallService.post('/login', data, null)
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