import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'

export default  class PermitStore extends StoreBase {

    @observable statistic = []
    constructor() {
        super()
        this.invokeListApi = (parameter) => api.permit.list(parameter);
        this.invokeSaveApi = (model) => api.permit.save(model);
        this.invokeDeleteApi = (id) => api.permit.delete(id)
    }

    @action async getStatistic() {
        return this.invokeApi(() => api.permit.statistic(),
            (response) => this.statistic = response.data)
    }
}