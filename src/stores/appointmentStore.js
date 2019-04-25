import { observable, action } from 'mobx'
import api from '../common/api'
class AppointmentStore {

    @observable list = [];
    @observable myList = [];
    @observable loading = false;

    @action async setList(batchUuid, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.reserve.list(batchUuid, pageIndex, pageSize);
        if (response) {
            this.list = response.list;
        }
        this.loading = false;
    }

    @action async setMyList() {
        this.loading = true;
        const response = await api.reserve.history(null, 1, 100);
        if (response && response.data) {
            this.myList = response.data.list || []
        }
        this.loading = false;
    }

    @action async make(batchUuid, quotaUuid) {
        this.loading = true;
        const result = await api.reserve.reserve(batchUuid, quotaUuid)
        this.loading = false;
        return result
    }

    @action async delete(quotaUuid) {
        this.loading = true;
        const result = await api.quota.delete(quotaUuid);
        this.loading = false;
        return result
    }

}

const store = new AppointmentStore();
export default store;