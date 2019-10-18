import api from '../common/api'
import StoreBase from './storeBase'

class QuotaStore extends StoreBase {

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.quota.list(parameter);
        this.invokeSaveApi = (model) => api.quota.save(model)
        this.invokeDeleteApi = (id) => api.quota.delete(id);
    }
}

export default new QuotaStore();