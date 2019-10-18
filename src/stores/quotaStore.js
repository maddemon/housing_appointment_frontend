import api from '../common/api'
import StoreBase from './storeBase'

class QuotaStore extends StoreBase {

    constructor() {
        super()
        this.getListFunc = (parameter) => api.quota.list(parameter);
        this.saveModelFunc = (model) => api.quota.save(model)
        this.deleteFunc = (id) => api.quota.delete(id);
    }
}

export default new QuotaStore();