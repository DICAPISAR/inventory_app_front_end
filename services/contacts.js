const apiCallService = require('./apiCall')

let uri = 'localhost:8082';

exports.createNewContactByProviderId = async (providerId, name, phoneNumber, email, sessionId) => {
    let data = {
        'name': name,
        'phoneNumber': phoneNumber,
        'email': email
    };

    let response = await apiCallService.post(uri + '/providers/' + providerId + '/create_new_contact', data, sessionId);
    if (response.getDataError !== null) {
        return {
            'isContactCreated': false,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'isContactCreated': response.getDataResponse.status === 201,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getContactListByProviderId = async (providerId, sessionId) => {
    let response = await apiCallService.get(uri + '/providers/' + providerId + '/list_contacts', sessionId);
    if (response.getDataError !== null) {
        return {
            'contactsList': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }

    return {
        'contactsList': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.getContactByIdAndProviderId = async (providerId, contactsId, sessionId) => {
    let response = await apiCallService.get(uri + '/providers/' + providerId + '/contacts/' + contactsId, sessionId);
    if (response.getDataError !== null) {
        return {
            'contact': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'contact': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}

exports.updateContactByIdAndProviderId = async (providerId, contactsId, name, phoneNumber, email, sessionId) => {
    let data = {
        'name': name,
        'phoneNumber': phoneNumber,
        'email': email
    };
    let response = await apiCallService.post(uri + '/providers/' + providerId + '/contacts/' + contactsId, data, sessionId);
    if (response.getDataError !== null) {
        return {
            'contact': null,
            'isForbidden': response.isLoginError,
            'error': response.getDataError
        }
    }
    return {
        'contact': response.getDataResponse.data,
        'isForbidden': response.isLoginError,
        'error': response.getDataError
    }
}