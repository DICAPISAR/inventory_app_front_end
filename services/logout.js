const apiCallService = require('./apiCall')

exports.login = async (userName, password) => {
    let data = {
        'name': userName,
        'password': password
    }

    let response = await apiCallService.post('/login', data, 'asdfasdfa')

    if (response === undefined) {
        return {
            'isLogin': false,
            'sessionCookie': null
        }
    }

    return {
        'isLogin': response.status === 200,
        'sessionCookie': response.headers["set-cookie"]
    }

}