import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'

class AppointmentStore extends StoreBase {

    @observable resultList = [];
    @observable successState = {}

    constructor() {
        super();
        this.getListFunc = (parameter) => {
            return api.appointment.list(parameter);
        };
        this.saveModelFunc = (model) => {
            return api.appointment.save(model)
        };
        this.deleteFunc = (id)=>{
            return api.appointment.delete(id)
        };
    }

    @action async getList(parameter) {
        this.loading = true;
        const response = await api.appointment.list(parameter);
        if (response) {
            this.list = response.list;
            this.page = response.page
        }
        this.loading = false;
        return this.list
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
        if (response && response.ok) {
            this.successState[batchId] = response
            return this.successState[batchId]
        }
    }
}

const store = new AppointmentStore();
export default store;