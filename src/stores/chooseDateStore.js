import api from '../common/api'
import StoreBase from './storeBase'
import { action } from 'mobx';

export default class HousesStore extends StoreBase {

    constructor() {
        super()
        this.invokeListApi = (batchId) => {
            if (!batchId) return;
            return api.chooseDate.list(batchId)
        };
        this.invokeSaveApi = (model) => api.chooseDate.save(model);
        this.invokeDeleteApi = (id) => api.chooseDate.delete(id);
    }

    @action getDefaultModel = (batchId) => {
        if (!this.list || this.list.length === 0) {
            this.getList(batchId);
        }
        const model = this.list.find(e => new Date(e.Day) > new Date());
        console.log(model)
        return this.model = model;
    }
}