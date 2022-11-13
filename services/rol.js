const apiCallService = require('./apiCall')

exports.getRolList = async (sessionId) => {
    let response = await apiCallService.get('/roles/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'isForbidden': response.isLoginError,
            'error': response.getDataError,
            'rolesListData': null
        }
    }
    return {
        'isForbidden': response.isLoginError,
        'error': response.getDataError,
        'rolesListData': response.getDataResponse.data
    }
}