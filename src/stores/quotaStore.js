import api from '../common/api'
import StoreBase from './storeBase'

class QuotaStore extends StoreBase {

    constructor() {
        super()
        this.getListFunc = (parameter) => {
            return api.quota.list(parameter);
        };
        this.saveModelFunc = (model) => {
            return api.quota.save(model)
        };
        this.deleteFunc = (id)=>{
            return api.quota.delete(id)
        }
    }
}

const store = new QuotaStore();
export default store;