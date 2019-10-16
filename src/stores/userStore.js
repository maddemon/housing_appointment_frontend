import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../common/api';

class UserStore {
    @observable list = [];
    @observable page = {};
    @observable loading = false;

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
        const user = await api.user.login(formData);
        cookie.save(this.cookieName, user.token, { path: '/' })
        window.localStorage.clear();
        await window.localStorage.setItem(this.cookieName, JSON.stringify(user))
        this.loading = false;
        return user;
    }

    @action async logout() {
        await window.localStorage.removeItem(this.cookieName)
        cookie.remove(this.cookieName)
    }

    @action async getList(key, pageIndex) {
        this.loading = true;
        const response = await api.user.list(key, pageIndex, 20);
        if (response.status === 200) {
            this.page = {
                pageSize: 20,
                pageIndex: pageIndex,
                total: response.page.total
            };
            this.list = response.list
        }
        this.loading = false;
        return this.list
    }

    @action async save(user) {
        this.loading = true;
        let result = null;
        if (user.id) {
            result = await api.user.edit(user)
        }
        else {
            result = await api.user.add(user)
        }
        this.loading = false;
        return result;
    }
    async delete(id) {
        await api.user.delete(id);
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

const store = new UserStore();
export default store;