import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../common/api';

const CookieName = "authtoken"

class UserStore {
    @observable list = [];
    @observable page = {};

    get current() {
        const sessionId = this.authenticated
        const json = window.localStorage.getItem(sessionId);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    }

    get authenticated() {
        const sessionId = cookie.load(CookieName)
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
        const sessionId = this.authenticated;
        window.localStorage.removeItem(sessionId)
        cookie.remove(CookieName)
    }

    async setList(pageIndex, pageSize) {
        const response = await api.user.list(pageIndex, pageSize);
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.list
    }

    async save(user) {
        if (user.uuid) {
            await api.user.edit(user)
        }
        else {
            await api.user.add(user)
        }
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

    get importUrl() {
        return api.user.getImportUrl()
    }
}

const store = new UserStore();
export default store;