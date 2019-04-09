import { observable, action } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable myList = [];

    async setList(page, rows) {
        this.list = await api.quota.list(page, rows)
    }

    async setMyList() {
        this.myList =  await api.quota.listOfCustomer()
    }

    async save(data) {
        await api.quota.add(data);
    }

    async delete(quotaUuid) {
        await api.quota.delete(quotaUuid)
    }

}

const store = new QuotaStore();
export default store;