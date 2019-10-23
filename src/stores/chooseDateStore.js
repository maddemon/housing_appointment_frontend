import api from '../common/api'
import StoreBase from './storeBase'

export default class HousesStore extends StoreBase {

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.chooseDate.list(parameter);
        this.invokeSaveApi = (model) => api.chooseDate.save(model);
        this.invokeDeleteApi = (id) => api.chooseDate.delete(id);
    }
}