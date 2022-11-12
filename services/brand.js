const apiCallService = require('./apiCall')

exports.createNewBrand = async (brandName, sessionId) => {
    let data = {
        'name': brandName,
    };
    let response = await apiCallService.post('/brands/create', data, sessionId)
    if (response.getDataError !== null) {
        return {
            'isBrandCreated': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'isBrandCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getBrandList = async (sessionId) => {
    let response = await apiCallService.get('/brands/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'brandList': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'brandList': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getBrandById = async (brandId, sessionId) => {
    let response = await apiCallService.get('/brands/' + brandId, sessionId);
    if (response.getDataError !== null) {
        return {
            'brand': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'brand': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.updateBrandById = async (brandId, brandName, sessionId) => {
    let data = {
        'name': brandName,
    }
    let response = await apiCallService.post('/brands/' + brandId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'brand': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'brand': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}