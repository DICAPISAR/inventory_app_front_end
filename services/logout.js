const apiCallService = require('./apiCall')
const getConstants = require("./constants");

exports.logout = async (sessionId) => {
    let response = await apiCallService.post(getConstants('urlSession') + '/logout', null, sessionId)
    if (response.getDataError !== null) {
        return {
            isLogout: false
        }
    }
    return {
        isLogout: response.getDataResponse.status === 200
    }
}