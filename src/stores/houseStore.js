import api from '../common/api'
import StoreBase from './storeBase'

class HousesStore extends StoreBase {

    constructor() {
        super()
        this.getListFunc = (parameter) => api.house.list(parameter);
        this.saveModelFunc = (model) => api.house.save(model);
        this.deleteFunc = (id) => api.house.delete(id);
    }

    get importUrl() {
        return api.house.getImportUrl();
    }
}

export default new HousesStore();