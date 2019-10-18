import api from '../common/api'
import StoreBase from './storeBase'

class HousesStore extends StoreBase {

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.house.list(parameter);
        this.invokeSaveApi = (model) => api.house.save(model);
        this.invokeDeleteApi = (id) => api.house.delete(id);
    }

    get importUrl() {
        return api.house.getImportUrl();
    }
}

export default new HousesStore();