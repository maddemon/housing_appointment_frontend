import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../common/api';

const CookieName = "authtoken"

class UserStore {
    @observable list = [];
    @observable page = {};
    @observable loading = false;

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
        this.loading = true;
        const data = await api.user.login(username, password);
        if (data && data.status === '200') {
            const user = data.data;
            cookie.save(CookieName, user.sessionId, { path: '/' })
            window.localStorage.clear();
            await window.localStorage.setItem(user.sessionId, JSON.stringify(user))
        }
        this.loading = false;
    }

    logout() {
        const sessionId = this.authenticated;
        window.localStorage.removeItem(sessionId)
        cookie.remove(CookieName)
    }

    async setList(pageIndex, pageSize) {
        this.loading = true;
        const response = await api.user.list(pageIndex, pageSize);
        if (response && response.data) {
            this.page = {
                pageSize: pageSize,
                pageIndex: pageIndex,
                total: response.data.total
            };
        }
        this.list = response.data.list
        this.loading = false;
    }

    async save(user) {
        this.loading = true;
        let result = null;
        if (user.uuid) {
            result = await api.user.edit(user)
        }
        else {
            result = await api.user.add(user)
        }
        this.loading = false;
        return result;
    }
    async delete(uuid) {
        await api.user.delete(uuid);
    }
    async editPassword(oldPassword, newPassword) {
        this.loading = true;
        const result = await api.user.editPassword(oldPassword, newPassword)
        this.loading = false;
        return result;
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