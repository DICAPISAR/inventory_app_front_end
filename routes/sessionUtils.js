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
