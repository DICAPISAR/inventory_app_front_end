const apiCallService = require('./apiCall');

let uri = 'localhost:8081';

exports.changePassword = async (newPassword, sessionId) => {
    let data = {
        'newPassword': newPassword
    }

    let response = await apiCallService.post(uri + '/users/update_password', data, sessionId);

    if (response.getDataError !== null) {
        return {
            'isChangePassword': false,
            'changePasswordData': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'isChangePassword': response.getDataResponse.status === 200,
        'changePasswordData': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}