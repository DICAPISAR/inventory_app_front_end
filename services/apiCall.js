const getConstant = require('./constants')
const {response} = require("express");
const axios = require('axios').create({
    //baseURL: getConstant('baseUrl'),
    timeout: getConstant('timeout'),
    responseType: 'json',
    withCredentials: false,
    headers: {'content-type': 'application/json'},
});

class Response {
    constructor(dataResponse, dataErrorRequest, dataErrorResponse, dataError, hasLoginError) {
        this.dataResponse = dataResponse;
        this.dataError = dataError;
        this.dataErrorRequest = dataErrorRequest;
        this.dataErrorResponse = dataErrorResponse;
        this.hasLoginError = hasLoginError;
    }
    //Getters
    get getDataResponse() {
        return this.dataResponse;
    }

    get getDataError() {
        return this.dataError;
    }

    get getDataErrorRequest() {
        return this.dataErrorRequest;
    }

    get getDataErrorResponse() {
        return this.dataErrorResponse;
    }

    get isLoginError() {
        return this.hasLoginError;
    }

    //Setters
    setDataResponse(data) {
        this.dataResponse = data;
    }

    setDataError(data) {
        this.dataError = data;
    }

    setDataErrorRequest(data) {
        this.dataErrorRequest = data;
    }

    setDataErrorResponse(data) {
        this.dataErrorResponse = data;
    }

    setIsLoginError(data) {
        this.hasLoginError = data;
    }

}

exports.get = async (uri, sessionId) => {
    let dataResponse = new Response(null, null, null, null, false);
    let config = {}
    if (sessionId !== null){
        config = {
            headers: {
                Cookie: [
                    'SESSION=' + sessionId + '; Path=/; HttpOnly;'
                ],
            }
        }
    }
    let apiResponse = await axios.get(uri, config).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 403) {
                dataResponse.setIsLoginError(true);
            }
            dataResponse.setDataErrorResponse(error.response);
            dataResponse.setDataError(error.message)
        } else if (error.request) {
            console.log(error.request);
            dataResponse.setDataErrorRequest(error.request)
            dataResponse.setDataError(error.message)
        } else {
            console.log('Error', error.message);
            dataResponse.setDataError(error.message)
            dataResponse.setDataError(error.message)
        }
        console.log(error.config);
    })
    dataResponse.setDataResponse(apiResponse);
    return dataResponse;
}

exports.post = async (uri, body, sessionId) => {
    let dataResponse = new Response(null, null, null, null, false);
    let config = {}
    if (sessionId !== null){
        config = {
            headers: {
                Cookie: [
                    'SESSION=' + sessionId + '; Path=/; HttpOnly;'
                ],
            }
        }
    }
    let apiResponse = await axios.post(uri, body, config).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 403) {
                dataResponse.setIsLoginError(true);
            }
            dataResponse.setDataErrorResponse(error.response);
            dataResponse.setDataError(error.message)
        } else if (error.request) {
            console.log(error.request);
            dataResponse.setDataErrorRequest(error.request)
            dataResponse.setDataError(error.message)
        } else {
            console.log('Error', error.message);
            dataResponse.setDataError(error.message)
            dataResponse.setDataError(error.message)
        }
        console.log(error.config);
    })
    dataResponse.setDataResponse(apiResponse);
    return dataResponse;
}