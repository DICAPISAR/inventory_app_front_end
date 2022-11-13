const apiCallService = require('./apiCall')

exports.createNewUser = async (name, rolId, sessionId) => {
    let data = {
        'name': name,
        'rol': rolId
    };
    let response = await apiCallService.post('/users/create', data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isUserCreated': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError,
            'userData': response.getDataResponse.data
        }
    }
    return {
        'isUserCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError,
        'error': response.getDataError,
        'userData': response.getDataResponse.data
    }
}

exports.getUserList = async (sessionId) => {
    let response = await apiCallService.get('/users/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'isForbidden': response.isLoginError,
            'error': response.getDataError,
            'userListData': null,
        }
    }
    return {
        'isForbidden': response.isLoginError,
        'error': response.getDataError,
        'userListData': response.getDataResponse.data
    }
}

exports.changePasswordToUserId = async (userId, newPassword, sessionId) => {
    let data = {
        'newPassword': newPassword
    }
    let response = await apiCallService.post('/users/update_password/' + userId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isChangePassword': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError,
        }
    }
    return {
        'isChangePassword': response.getDataResponse.status === 200,
        'isForbidden': response.isLoginError,
        'error': response.getDataError,
    }
}