import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'

class AppointmentStore extends StoreBase {

    @observable resultList = [];
    @observable successState = {}

    constructor() {
        super();
        this.getListFunc = (parameter) => api.appointment.list(parameter);
        this.saveModelFunc = (model) => api.appointment.save(model);
        this.deleteFunc = (id) => api.appointment.delete(id);
    }

    @action make(batchId, userQuotaId) {
        return this.invokeApi(() => api.appointment.make(batchId, userQuotaId))
    }
}

export default new AppointmentStore();