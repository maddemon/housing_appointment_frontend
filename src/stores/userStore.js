import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../common/api';
import StoreBase from './storeBase'
class UserStore extends StoreBase {

    constructor() {
        super()
        this.getListFunc = (parameter) => {
            return api.user.list(parameter);
        };
        this.saveModelFunc = (model) => {
            return api.user.save(model)
        };
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

    @action async login(formData) {
        this.loading = true;
        const response = await api.user.login(formData);
        if (response && response.ok) {
            const user = response.data;
            cookie.save(this.cookieName, user.token, { path: '/' })
            window.localStorage.clear();
            await window.localStorage.setItem(this.cookieName, JSON.stringify(user))
        }
        this.loading = false;
        return response;
    }

    @action async logout() {
        await window.localStorage.removeItem(this.cookieName)
        cookie.remove(this.cookieName)
    }


    async editPassword(oldPassword, newPassword) {
        this.loading = true;
        const result = await api.user.editPassword(oldPassword, newPassword)
        this.loading = false;
        return result;
    }
    async  sendVerifyCode(mobile) {
        await api.user.sendVerifyCode(mobile)
    }

    async resetPassword(id) {
        await api.user.resetPassword(id)
    }
}

export default new UserStore();