import { observable } from 'mobx'
import api from '../common/api'
class ReserveStore {

    @observable list = [];
    @observable myList = [];

    async setList(batchUuid, pageIndex, pageSize) {
        const response = await api.reserve.list(batchUuid, pageIndex, pageSize);
        if (!response) return;
        this.list = response.list;
    }

    async setMyList(userUuid) {
        const response = await api.reserve.history(userUuid, 1, 1000);
        if (!response) return;
        this.myList = response.list || []
    }

    async make(batchUuid, quotaUuid) {
        return await api.reserve.reserve(batchUuid, quotaUuid)
    }

    async delete(quotaUuid) {
        await api.quota.delete(quotaUuid)
    }

}

const store = new ReserveStore();
export default store;