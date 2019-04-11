import Config from '../common/config'
import { message } from 'antd'
// function queryStringToJson(str) {
//     let json = {}
//     str.split('&').map(kv => {
//         let arr = kv.split('=')
//         if (arr.length === 2) {
//             json[arr[0]] = decodeURIComponent(arr[1])
//         }
//         return json
//     })
//     return json;
// }
function jsonToQueryString(json) {
    if (!json)
        return '';
    return Object
        .keys(json)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent((json[key] === null || json[key] === undefined) ? '' : json[key]))
        .join('&');
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

async function request(path, query, data, httpMethod) {
    let url = path
    if (path.indexOf('http') !== 0) {
        url = Config.Host + Config.ApiPath + path
    }
    if (query) {
        if (url.indexOf('?') > -1) {
            url += jsonToQueryString(query)
        } else {
            url += '?' + jsonToQueryString(query)
        }
    }
    let options = {
        'method': httpMethod,
        'headers': {
            //'token': userStore.token || '',
            'Content-Type': 'application/json',
        }
    }
    try {
        console.debug(url)
        let result = undefined;
        switch (httpMethod) {
            case 'GET':
            case 'DELETE':
                result = await fetch(url, options)
                break;
            case 'POST':
                options.body = JSON.stringify(data)
                result = await fetch(url, options)
                break;
            default:
                break;
        }
        console.debug('result._bodyText', result._bodyText)
        let response = result._bodyText
        if (response) {
            try {
                response = JSON.parse(response)
            }
            catch (ex) {
            }
        }
        if (result.status === 200 || result.status === 204) {
            return response
        } else {
            throwException(response)
        }
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
    },
}
export { $ as default }