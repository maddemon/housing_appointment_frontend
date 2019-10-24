import cookie from 'react-cookies';
import api from '../common/api';
import StoreBase from './storeBase'
export default class UserStore extends StoreBase {

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.user.list(parameter);
        this.invokeSaveApi = (model) => api.user.save(model);
    }

    cookieName = "token";

    current() {
        const sessionId = cookie.load(this.cookieName)
        if (sessionId) {
            const json = window.localStorage.getItem(this.cookieName);
            if (json) {
                return JSON.parse(json);
            }
        }
        return null;
    }

    isCurrentUser(userId) {
        return this.current.id === userId;
    }

    login(formData) {
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

    editPassword(oldPassword, newPassword) {
        return this.invokeApi(() => api.user.editPassword(oldPassword, newPassword))
    }

    resetPassword(id) {
        return this.invokeApi(() => api.user.resetPassword(id))
    }
}