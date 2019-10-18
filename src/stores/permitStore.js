import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'

class PermitStore extends StoreBase {

    @observable statistic = []
    constructor() {
        super()
        this.getListFunc = (parameter) => api.permit.list(parameter);
        this.saveModelFunc = (model) => api.permit.save(model);
        this.deleteFunc = (id) => api.permit.delete(id)
    }

    @action async getStatistic() {
        return this.invokeApi(() => api.permit.statistic(),
            (response) => this.statistic = response.data)
    }
}

const store = new PermitStore();
export default store;