const apiCallService = require('./apiCall')

exports.createNewItem = async (name, price, brandId, typeItemId, sessionId) => {
    let data = {
        "name": name,
        "price": price,
        "brand": brandId,
        "typeItem": typeItemId
    };

    let response = await apiCallService.post('/items/create/', data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isItemCreated': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'isItemCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getItemById = async (itemId, sessionId) => {
    let response = await apiCallService.get('/items/' + itemId, sessionId);
    if (response.getDataError !== null) {
        return {
            'item': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'item': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getItemList = async (sessionId) => {
    let response = await apiCallService.get('/items/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'itemList': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'itemList': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.updateItemById = async (itemId, name, price, brandId, typeItemId, sessionId) => {
    let data = {
        "name": name,
        "price": price,
        "brand": brandId,
        "typeItem": typeItemId
    };
    let response = await apiCallService.post('/items/' + itemId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'item': null,
            'isItemUpdated': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'item': response.getDataResponse.data,
        'isItemUpdated': response.getDataResponse.status === 200,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}
