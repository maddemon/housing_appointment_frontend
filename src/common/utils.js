import Config from "../common/config";
import { message } from "antd";
import userStore from "../stores/userStore";
const QueryString = {
  parseJSON: str => {
    let json = {};
    if (!str) return json;
    str
      .replace("?", "")
      .split("&")
      .map(kv => {
        let arr = kv.split("=");
        if (arr.length === 2) {
          json[arr[0]] = decodeURIComponent(arr[1]);
        }
        return json;
      });
    return json;
  },
  stringify: json => {
    if (!json) return "";
    return Object.keys(json)
      .map(
        key =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(
            json[key] === null || json[key] === undefined ? "" : json[key]
          )
      )
      .join("&");
  }
};

const reloadPage = (props, parameter) => {
  let query = QueryString.parseJSON(props.location.search);
  query = { ...query, ...parameter };

  if (!parameter.pageIndex && query.pageIndex) {
    query.pageIndex = "1";
  }
  props.history.push(
    props.location.pathname + "?" + QueryString.stringify(query)
  );
};

function throwException(res) {
  try {
    message.error(res.exceptionMessage || res.message);
  } catch (ex) {
    message.error("未知错误");
  }
}

function getRequestUrl(path, query) {
  let url = path;
  if (path.indexOf("http") !== 0) {
    url = Config.Host + Config.ApiPath + path;
  }
  if (query) {
    if (url.indexOf("?") > -1) {
      url += QueryString.stringify(query);
    } else {
      url += "?" + QueryString.stringify(query);
    }
  }
  return url;
}

async function request(path, query, data, httpMethod) {
  let url = getRequestUrl(path, query);
  let options = {
    method: httpMethod,
    credentials: "include",
    mode: "cors"
  };
  if (
    data === null ||
    (typeof data === "object" && Object.keys(data).length > 0)
  ) {
    options.headers = {
      "Content-Type": "application/json"
    };
  }
  try {
    let response = undefined;
    switch (httpMethod) {
      case "GET":
      case "DELETE":
        response = await fetch(url, options);
        break;
      case "POST":
      case "PUT":
        options.body = JSON.stringify(data);
        response = await fetch(url, options);
        break;
      default:
        break;
    }
    var result = { ok: response.ok, status: response.status };
    switch (response.status) {
      case 200:
        result.data = await response.json();
        return result;
      case 204:
        return result;
      case 405:
        result.message = "接口不支持当前请求方式";
        break;
      case 404:
        result.message = "接口不存在";
        break;
      case 401:
        result.message = "权限不足";
        await userStore.logout();
        break;
      default:
        Object.assign(result, await response.json());
        break;
    }
    throwException(result);
  } catch (err) {
    throwException(err);
  }
  return result;
}

const $ = {
  get: (path, query) => {
    return request(path, query, null, "GET");
  },
  post: (path, query, data) => {
    return request(path, query, data, "POST");
  },
  put: (path, query, data) => {
    return request(path, query, data, "PUT");
  },
  delete: (path, query) => {
    return request(path, query, null, "DELETE");
  }
};
export { $ as default, QueryString, reloadPage };
