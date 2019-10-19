import api from '../common/api'
import StoreBase from './storeBase'

export default class QuotaStore extends StoreBase {

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.quota.list(parameter);
        this.invokeSaveApi = (model) => api.quota.save(model)
        this.invokeDeleteApi = (id) => api.quota.delete(id);
        this.invokeGetModelApi = (id) => api.quota.getModel(id);
    }
}