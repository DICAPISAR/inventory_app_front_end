const apiCallService = require('./apiCall')

exports.login = async (userName, password) => {
    let data = {
        'name': userName,
        'password': password
    }
    let response = await apiCallService.post('/login', data, null)
    if (response === undefined) {
        return {
            'isLogin': false,
            'cookie': null
        }
    }
    return {
        'isLogin': response.status === 200,
        'cookie': response.headers["set-cookie"]
    }
}