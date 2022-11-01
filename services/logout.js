const apiCallService = require('./apiCall')

exports.logout = async (sessionId) => {
    let response = await apiCallService.post('/logout', null, sessionId)
    if (response.getDataError !== null) {
        return {
            isLogout: false
        }
    }
    return {
        isLogout: response.getDataResponse.status === 200
    }
}