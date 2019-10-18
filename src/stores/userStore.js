import cookie from 'react-cookies';
import api from '../common/api';
import StoreBase from './storeBase'
class UserStore extends StoreBase {

    constructor() {
        super()
        this.getListFunc = (parameter) => api.user.list(parameter);
        this.saveModelFunc = (model) => api.user.save(model);
    }

    cookieName = "token";

    current() {
        const json = window.localStorage.getItem(this.cookieName);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    }

    authenticated() {
        const sessionId = cookie.load(this.cookieName)
        return sessionId
    }

    async login(formData) {
        return this.invokeApi(() => api.user.login(formData), (response) => {
            const user = response.data;
            cookie.save(this.cookieName, user.token, { path: '/' })
            window.localStorage.clear();
            window.localStorage.setItem(this.cookieName, JSON.stringify(user))
        })
    }

    logout() {
        window.localStorage.removeItem(this.cookieName)
        cookie.remove(this.cookieName)
    }


    async editPassword(oldPassword, newPassword) {
        return this.invokeApi(() => api.user.editPassword(oldPassword, newPassword))
    }
    async  sendVerifyCode(mobile) {
        return this.invokeApi(() => api.user.sendVerifyCode(mobile))
    }

    async resetPassword(id) {
        return this.invokeApi(() => api.user.resetPassword(id))
    }
}

export default new UserStore();