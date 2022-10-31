const apiCallService = require('./apiCall')

exports.logout = async (sessionId) => {
    let response = await apiCallService.post('/logout', null, sessionId)
    if (response === undefined) {
        return {
            isLogout: false
        }
    }
    return {
        isLogout: true
    }
}