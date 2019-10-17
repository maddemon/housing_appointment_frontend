import api from '../common/api'
import StoreBase from './storeBase'

class HousesStore extends StoreBase {

    constructor() {
        super()
        this.getListFunc = (parameter) => {
            return api.house.list(parameter);
        };
        this.saveModelFunc = (model) => {
            return api.house.save(model)
        };
        this.deleteFunc = (id) => {
            return api.house.delete(id)
        }
    }

    get importUrl() {
        return api.house.getImportUrl();
    }
}

const store = new HousesStore();
export default store;