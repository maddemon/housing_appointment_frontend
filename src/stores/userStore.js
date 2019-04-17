import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../common/api';

const CookieName = "authtoken"

class UserStore {
    @observable list = [];
    @observable page = {};

    constructor() {
        console.log(document.cookie)
    }

    current() {
        const sessionId = this.authenticated()
        const json = window.localStorage.getItem(sessionId);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    }

    authenticated() {
        console.log(cookie.loadAll())
        const sessionId = cookie.load(CookieName)
        console.log('sessionId', sessionId)
        return sessionId
    }

    @action async login(username, password) {
        const data = await api.user.login(username, password);
        if (data && data.status === '200') {
            const user = data.data;
            cookie.save(CookieName, user.sessionId, { path: '/' })
            window.localStorage.clear();
            await window.localStorage.setItem(user.sessionId, JSON.stringify(user))
        }
    }

    logout() {
        const sessionId = cookie.remove(CookieName)
        window.localStorage.removeItem(sessionId)
        cookie.remove(CookieName)
    }

    async setList(pageIndex, pageSize) {
        const response = await api.user.list(pageIndex, pageSize);
        console.log(response)
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.list
    }

    async save(user) {
        return await api.user.edit(user)
    }
    async delete(uuid) {
        await api.user.delete(uuid);
    }
    async editPassword(oldPassword, newPassword) {
        await api.user.editPassword(oldPassword, newPassword)
    }

    async resetPassword(uuid) {
        await api.user.resetPassword(uuid)
    }

    async import(data) {
        await api.user.import(data)
    }
}

const store = new UserStore();
export default store;