const apiCallService = require('./apiCall')

exports.getDashboardsInfo = async (sessionId) => {

    let response = await apiCallService.get('/dashboards', sessionId)
    if (response.getDataError !== null) {
        return {
            'dashboardInfo': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'dashboardInfo': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}