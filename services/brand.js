const apiCallService = require('./apiCall')
const getConstants = require('./constants')

exports.createNewBrand = async (brandName, sessionId) => {
    let data = {
        'name': brandName,
    };
    let response = await apiCallService.post(getConstants('urlCore') + '/brands/create', data, sessionId)
    if (response.getDataError !== null) {
        return {
            'isBrandCreated': false,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'isBrandCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError
    }
}

exports.getBrandList = async (sessionId) => {
    let response = await apiCallService.get(getConstants('urlCore') + '/brands/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'brandList': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'brandList': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}

exports.getBrandById = async (brandId, sessionId) => {
    let response = await apiCallService.get(getConstants('urlCore') + '/brands/' + brandId, sessionId);
    if (response.getDataError !== null) {
        return {
            'brand': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'brand': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}

exports.updateBrandById = async (brandId, brandName, sessionId) => {
    let data = {
        'name': brandName,
    }
    let response = await apiCallService.post(getConstants('urlCore') + '/brands/' + brandId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'brand': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'brand': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}