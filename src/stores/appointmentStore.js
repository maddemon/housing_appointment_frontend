import { observable } from 'mobx'
import api from '../common/api'
class ReserveStore {

    @observable list = [];
    @observable myList = [];

    async setList(page, rows) {
        this.list = await api.quota.list(page, rows)
    }

    async setMyList() {
    }

    async make(batchUuid, quotaUuid) {
        await api.reserve.reserve(batchUuid, quotaUuid)
    }

    async delete(quotaUuid) {
        await api.quota.delete(quotaUuid)
    }

}

const store = new ReserveStore();
export default store;