import { observable } from 'mobx'
import api from '../common/api'
class UserStore {

    @observable current = null;

    @observable list = [];

    constructor() {
        this.initUserFromLocalStorage();
    }

    initUserFromLocalStorage() {
        const json = window.localStorage.getItem("user");
        if (json) {
            this.current = JSON.parse(json);
        }
    }

    async login(username, password) {
        //let user = await api.user.login(username, password);
        let user = { name: 'Tester', role: 1 };
        this.current = user;
        await window.localStorage.setItem("user", JSON.stringify(user));
    }

    logout() {
        window.localStorage.removeItem("user");
        this.current = null;
    }

    async list(page, rows) {
        this.list = await api.user.list(page, rows)
    }

    async editPassword(oldPassword, newPassword) {
        await api.user.editPassword(oldPassword, newPassword)
    }

    async resetPassword(uuid) {
        await api.user.resetPassword(uuid)
    }
}

const store = new UserStore();
export default store;