const apiCallService = require('./apiCall')

exports.createNewProvider = async (name, address, phoneNumber, documentNumber, email, sessionId) => {
    let data = {
        'name': name,
        'address': address,
        'phoneNumber': phoneNumber,
        'documentNumber': documentNumber,
        'email': email
    };

    let response = await apiCallService.post('/providers/create', data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isProviderCreated': false,
            'isForbidden': response.isLoginError
        }
    }

    return {
        'isProviderCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError
    }
}

exports.getProviderList = async (sessionId) => {
    let response = await apiCallService.get('/providers/list', sessionId);
    if (response.getDataError !== null) {
        return {
            'providerList': null,
            'isForbidden': response.isLoginError
        }
    }

    return {
        'providerList': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}

exports.getProviderById = async (providerId, sessionId) => {
    let response = await apiCallService.get('/providers/' + providerId, sessionId);
    if (response.getDataError !== null) {
        return {
            'provider': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'provider': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}

exports.updateProviderById = async (providerId, name, address, phoneNumber, documentNumber, email, sessionId) => {
    let data = {
        'name': name,
        'address': address,
        'phoneNumber': phoneNumber,
        'documentNumber': documentNumber,
        'email': email
    };
    let response = await apiCallService.post('/providers/' + providerId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'provider': null,
            'isForbidden': response.isLoginError
        }
    }
    return {
        'provider': response.getDataResponse.data,
        'isForbidden': response.isLoginError
    }
}