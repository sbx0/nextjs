import {getCookie} from "./cookies";
import {toast} from "react-toastify";

// In order to expose a variable to the browser you have to prefix the variable with NEXT_PUBLIC_.
const server = process.env.NEXT_PUBLIC_API_URL;
const version = process.env.NEXT_PUBLIC_VERSION;

export async function get(url, params, cookies) {

    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach((key) =>
            paramsArray.push(key + '=' + encodeURI(params[key])));
        if (paramsArray.length > 0) {
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&');
            } else {
                url += '&' + paramsArray.join('&');
            }
        }
    }
    let headers = {'Content-Type': 'application/json;charset=UTF-8'}
    if (cookies != null) {
        if (cookies.token != null) {
            headers.token = cookies.token
            headers.version = version
        }
    } else {
        if (getCookie('token') != null) {
            headers.token = getCookie('token')
            headers.version = version
        }
    }
    const request = fetch(server + url, {
        method: 'GET',
        headers: headers,
    });
    return await _fetch(request).then((data) => data);
}

export async function upload(url, params, cookies) {
    let headers = {}
    if (cookies != null) {
        if (cookies.token != null) {
            headers.token = cookies.token
            headers.version = version
        }
    } else {
        if (getCookie('token') != null) {
            headers.token = getCookie('token')
            headers.version = version
        }
    }
    const request = fetch(server + url, {
        method: 'POST',
        headers: headers,
        body: params
    });
    return await _fetch(request).then((data) => data);
}

export async function post(url, params, cookies) {
    let headers = {'Content-Type': 'application/json;charset=UTF-8'}
    if (cookies != null) {
        if (cookies.token != null) {
            headers.token = cookies.token
            headers.version = version
        }
    } else {
        if (getCookie('token') != null) {
            headers.token = getCookie('token')
            headers.version = version
        }
    }
    const request = fetch(server + url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(params)
    });
    return await _fetch(request).then((data) => data);
}

export async function postForm(url, params) {
    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach((key) =>
            paramsArray.push(key + '=' + encodeURI(params[key])));
        if (paramsArray.length > 0) {
            params = paramsArray.join('&');
        }
    }
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    const request = fetch(server + url, {
        method: 'POST',
        headers: headers,
        body: params
    });
    return await _fetch(request).then((data) => data);
}

const _fetch = (request, timeout = 200000) => {
    const requestPromise = new Promise((resolve, reject) => {
            request
                .then((response) => {
                    return response;
                })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    toast(error, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
        }
    )
    const timerPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('请求超时');
        }, timeout)
    })
    return Promise.race([requestPromise, timerPromise]);
}
