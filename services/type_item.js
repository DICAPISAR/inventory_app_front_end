const apiCallService = require('./apiCall')

let uri = 'localhost:8082';

exports.createNewTypeItem = async (typeItemName, isPerishable, sessionId) => {
    let data = {
        'name': typeItemName,
        'isPerishable': isPerishable
    };

    let response = await apiCallService.post(uri + '/type_item/create', data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isTypeItemCreated': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'isTypeItemCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getTypeItemList = async (sessionId) => {
    let response = await apiCallService.get(uri + '/type_item/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'typeItemList': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'typeItemList': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getTypeItemById = async (typeItemId, sessionId) => {
    let response = await apiCallService.get(uri + '/type_item/' + typeItemId, sessionId);
    if (response.getDataError !== null) {
        return {
            'typeItem': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'typeItem': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.updateTypeItemById = async (typeItemId, typeItemName, isPerishable, sessionId) => {
    let data = {
        'name': typeItemName,
        'isPerishable': isPerishable
    };
    let response = await apiCallService.post(uri + '/type_item/' + typeItemId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'typeItem': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'typeItem': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}