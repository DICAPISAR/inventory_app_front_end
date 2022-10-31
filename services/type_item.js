const apiCallService = require('./apiCall')
const getConstants = require('./constants')

exports.createNewTypeItem = async (typeItemName, isPerishable, sessionId) => {
    let data = {
        'name': typeItemName,
        'isPerishable': isPerishable
    };

    let response = await apiCallService.post(getConstants('urlCore') + '/type_item/create', data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isTypeItemCreated': false,
            'isForbidden': response.isLoginError
        }
    }

    return {
        'isTypeItemCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError
    }
}

exports.getTypeItemList = async (sessionId) => {
    let response = await apiCallService.get(getConstants('urlCore') + '/type_item/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'typeItemList': null,
            'isForbidden': response.isLoginError
        }
    }

    return {
        'typeItemList': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}

exports.getTypeItemById = async (typeItemId, sessionId) => {
    let response = await apiCallService.get(getConstants('urlCore') + '/type_item/' + typeItemId, sessionId);
    if (response.getDataError !== null) {
        return {
            'typeItem': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'typeItem': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}

exports.updateTypeItemById = async (typeItemId, typeItemName, isPerishable, sessionId) => {
    let data = {
        'name': typeItemName,
        'isPerishable': isPerishable
    };
    let response = await apiCallService.post(getConstants('urlCore') + '/type_item/' + typeItemId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'typeItem': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'typeItem': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}