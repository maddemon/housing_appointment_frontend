import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'

class AppointmentStore extends StoreBase {

    @observable resultList = [];
    @observable successState = {}

    constructor() {
        super();
        this.invokeListApi = (parameter) => api.appointment.list(parameter);
        this.invokeSaveApi = (model) => api.appointment.save(model);
        this.invokeDeleteApi = (id) => api.appointment.delete(id);
    }

    @action make(batchId, userQuotaId) {
        return this.invokeApi(() => api.appointment.make(batchId, userQuotaId))
    }
}

export default new AppointmentStore();