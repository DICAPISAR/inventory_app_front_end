const apiCallService = require('./apiCall')

exports.getResults = async (value, sessionId) => {
    let response = await apiCallService.get('/search?value=' + value, sessionId);
    if (response.getDataError !== null) {
        return {
            'isForbidden': response.isLoginError,
            'error': response.getDataError,
            'resultData': null
        }
    }
    return {
        'isForbidden': response.isLoginError,
        'error': response.getDataError,
        'resultData': response.getDataResponse.data
    }
}