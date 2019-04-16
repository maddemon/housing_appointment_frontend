import { observable } from 'mobx'
import api from '../common/api'
class UserStore {

    @observable current = null;

    @observable list = [];
    @observable page = {};

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
        let user = { name: 'Tester', roleId: 2 };
        this.current = user;
        await window.localStorage.setItem("user", JSON.stringify(user));
    }

    logout() {
        window.localStorage.removeItem("user");
        this.current = null;
    }

    async setList(pageIndex, pageSize) {
        const response = await api.user.list(pageIndex, pageSize);
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.data.list
    }

    async saveUser(user) {
        return await api.user.edit(user)
    }
    async deleteUser(uuid) {
        await api.user.delete(uuid);
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