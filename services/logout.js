const apiCallService = require('./apiCall')

exports.logout = async (sessionId) => {
    let response = await apiCallService.post('/logout', null, sessionId)
    if (response.getDataError !== null) {
        return {
            isLogout: false,
            'error': response.getDataError
        }
    }
    return {
        isLogout: response.getDataResponse.status === 200,
        'error': response.getDataError
    }
}