import Config from '../common/config'
import { message } from 'antd'

const QueryString = {
    parseJSON: (str) => {
        let json = {}
        if (!str) return json
        str.replace('?','').split('&').map(kv => {
            let arr = kv.split('=')
            if (arr.length === 2) {
                json[arr[0]] = decodeURIComponent(arr[1])
            }
            return json
        })
        return json;
    },
    stringify: (json) => {
        if (!json)
            return '';
        return Object
            .keys(json)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent((json[key] === null || json[key] === undefined) ? '' : json[key]))
            .join('&');
    }
}

function throwException(res) {
    //alert(res.message);
    try {
        message.warn(res.message)
    }
    catch (ex) {
        message.warn('未知错误')
    }
}

function getRequestUrl(path, query) {
    let url = path
    if (path.indexOf('http') !== 0) {
        url = Config.Host + Config.ApiPath + path
    }
    if (query) {
        if (url.indexOf('?') > -1) {
            url += QueryString.stringify(query)
        } else {
            url += '?' + QueryString.stringify(query)
        }
    }
    return url;
}

async function request(path, query, data, httpMethod) {
    let url = getRequestUrl(path, query);
    let options = {
        'method': httpMethod,
        'credentials': 'include',
        'mode': 'cors',
    }
    if (data === null || (typeof data === 'object' && Object.keys(data).length > 0)) {
        options.headers = {
            'Content-Type': 'application/json',
        }
    }
    try {
        let response = undefined;
        switch (httpMethod) {
            case 'GET':
            case 'DELETE':
                response = await fetch(url, options)
                break;
            case 'POST':
                options.body = JSON.stringify(data)
                response = await fetch(url, options)
                break;
            default:
                break;
        }
        if (response.status === 404) {

        }
        const responseJson = await response.json();
        if (responseJson.status !== '200') {
            if (responseJson.status === '1100') {
                window.localStorage.clear();
            }
            throwException(responseJson);
        }
        console.log(responseJson)
        return responseJson;
    } catch (err) {
        throwException(err)
    }
}



const $ = {
    get: (path, query) => {
        return request(path, query, null, 'GET');
    },
    post: (path, query, data) => {
        return request(path, query, data, 'POST');
    },
    put: (path, query, data) => {
        return request(path, query, data, 'PUT');
    },
    delete: (path, query) => {
        return request(path, query, null, 'DELETE');
    }
}
export { $ as default, QueryString }