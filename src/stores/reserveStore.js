import { observable, action } from 'mobx'
import api from '../common/api'
class ReserveStore {

    @observable list = [];
    @observable myList = [];

    async list(page, rows) {
        this.list = await api.quota.list(page, rows)
    }

    async setMyList() {
        this.myList = await api.reserve.list()
    }

    async save(data) {
        await api.quota.add(data);
    }

    async delete(quotaUuid) {
        await api.quota.delete(quotaUuid)
    }

}

const store = new ReserveStore();
export default store;