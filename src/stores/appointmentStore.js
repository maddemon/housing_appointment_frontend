import { observable, action } from 'mobx'
import api from '../common/api'
class AppointmentStore {

    @observable list = [];
    @observable myList = [];
    @observable resultList = [];
    @observable loading = false;
    @observable successState = {}

    @action async getList(batchId, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.appointment.list(batchId, pageIndex, pageSize);
        if (response) {
            this.list = response.list;
        }
        this.loading = false;
        return this.list
    }

    @action async getMyList() {
        this.loading = true;
        const response = await api.appointment.history();
        if (response.status === 200) {
            this.myList = response.list || []
        }
        this.loading = false;
    }


    @action async make(batchId, quotaId) {
        this.loading = true;
        const result = await api.appointment.make(batchId, quotaId)
        this.loading = false;
        return result
    }

    @action async delete(quotaId) {
        this.loading = true;
        const result = await api.quota.delete(quotaId);
        this.loading = false;
        return result
    }

    @action async getSuccessState(batchId) {
        const response = await api.batch.successAppointment(batchId);
        if (response.status === 200) {
            this.successState[batchId] = response
            return this.successState[batchId]
        }
    }
}

const store = new AppointmentStore();
export default store;