const crypto = require('crypto-js');

exports.validateSession = (req) => {
    let cookies = req.cookies;
    let session = cookies.SESSION;
    return session != null;
}

exports.getCookie = (cookies, key) => {
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.includes(key)) {
            let cookieSplit = cookie.split(';');
            for (let j = 0; j < cookieSplit.length; j++) {
                let cookieSplitParam = cookieSplit[j];
                if (cookieSplitParam.includes(key)){
                    cookieSplit = cookieSplitParam.split('=');
                    return cookieSplit[1];
                }
            }
        }
    }
    return null;
}

exports.encryptJson = (json) => {
    let string = JSON.stringify(json);
    return crypto.AES.encrypt(string, 'secret key 123').toString();
}

exports.decryptJson = (string) => {
    let bytes = crypto.AES.decrypt(string, 'secret key 123');
    let stringDecrypt = bytes.toString(crypto.enc.Utf8);
    return JSON.parse(stringDecrypt)
}

exports.getUserIdFromEncrypt = (stringEncrypt) => {
    let infoSession = this.decryptJson(stringEncrypt)
    return infoSession.id;
}

exports.getRolIdFromEncrypt = (stringEncrypt) => {
    let infoSession = this.decryptJson(stringEncrypt)
    return infoSession.rolId;
}
