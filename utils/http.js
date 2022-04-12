import {getCookie} from "./cookies";
import {toast} from "react-toastify";
import axios from "axios";

// In order to expose a variable to the browser you have to prefix the variable with NEXT_PUBLIC_.
const server = process.env.NEXT_PUBLIC_API_URL;
const version = process.env.NEXT_PUBLIC_VERSION;
const region = process.env.NEXT_PUBLIC_REGION;
const timeout = 5000;

export function get(url, params, cookies, additionalHeaders) {

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
            headers.region = region
            headers.version = version
        }
    } else {
        if (getCookie('token') != null) {
            headers.token = getCookie('token')
            headers.region = region
            headers.version = version
        }
    }

    if (additionalHeaders != null) {
        headers['instance-id'] = additionalHeaders['instance-id'];
    }

    const request = axios({
        method: 'get',
        url: server + url,
        headers: headers,
        timeout: timeout
    });
    return _fetch(request).then((data) => data);
}

export function upload(url, params, cookies) {
    let headers = {}
    if (cookies != null) {
        if (cookies.token != null) {
            headers.token = cookies.token
            headers.region = region
            headers.version = version
        }
    } else {
        if (getCookie('token') != null) {
            headers.token = getCookie('token')
            headers.region = region
            headers.version = version
        }
    }
    const request = axios({
        method: 'post',
        url: server + url,
        headers: headers,
        timeout: timeout,
        data: params
    });
    return _fetch(request).then((data) => data);
}

export function post(url, params, cookies) {
    let headers = {'Content-Type': 'application/json;charset=UTF-8'}
    if (cookies != null) {
        if (cookies.token != null) {
            headers.token = cookies.token
            headers.region = region
            headers.version = version
        }
    } else {
        if (getCookie('token') != null) {
            headers.token = getCookie('token')
            headers.region = region
            headers.version = version
        }
    }
    const request = axios({
        method: 'post',
        url: server + url,
        headers: headers,
        timeout: timeout,
        data: JSON.stringify(params)
    });
    return _fetch(request).then((data) => data);
}

export function postForm(url, params) {
    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach((key) =>
            paramsArray.push(key + '=' + encodeURI(params[key])));
        if (paramsArray.length > 0) {
            params = paramsArray.join('&');
        }
    }
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    const request = axios({
        method: 'post',
        url: server + url,
        headers: headers,
        timeout: timeout,
        data: params
    });
    return _fetch(request).then((data) => data);
}

const _fetch = (request) => {
    return request.then((response) => {
        if (response.status !== 200) {
            toast(response.status, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        return response.data;
    })
}
