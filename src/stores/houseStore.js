import api from '../common/api'
import StoreBase from './storeBase'
import { observable, action } from 'mobx';

export default class HousesStore extends StoreBase {

    @observable rooms = []

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.house.list(parameter);
        this.invokeSaveApi = (model) => api.house.save(model);
        this.invokeDeleteApi = (id) => api.house.delete(id);
        this.invokeGetModelApi = (id) => api.house.getModel(id);
    }

    get importUrl() {
        return api.house.getImportUrl();
    }

    @action getRooms(batchId) {
        this.invokeApi(() => api.house.list({ batchId }), (response) => {
            this.rooms = response.data.list
        })
    }
}