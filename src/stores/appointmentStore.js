import { observable } from 'mobx'
import api from '../common/api'
class ReserveStore {

    @observable list = [];
    @observable myList = [];
    @observable loading = false;

    async setList(batchUuid, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.reserve.list(batchUuid, pageIndex, pageSize);
        if (!response) return;
        this.list = response.list;
        this.loading = false;
    }

    async setMyList(userUuid) {
        this.loading = true;
        const response = await api.reserve.history(userUuid, 1, 1000);
        if (!response) return;
        this.myList = response.list || []
        this.loading = false;
    }

    async make(batchUuid, quotaUuid) {
        this.loading = true;
        const result = await api.reserve.reserve(batchUuid, quotaUuid)
        this.loading = false;
        return result
    }

    async delete(quotaUuid) {
        await api.quota.delete(quotaUuid)
    }

}

const store = new ReserveStore();
export default store;