import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'
export default class BatchStore extends StoreBase {

    @observable avaliables = []

    @observable rooms = []
    @observable house = []
    @observable permits = []
    @observable selectedPermit = null;
    @observable selectedHouse = null;
    @observable selectedBuilding = null;
    @observable selectedUser = null

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.batch.list(parameter);
        this.invokeSaveApi = (model) => api.batch.save(model);
        this.invokeGetModelApi = (id) => api.batch.getModel(id);
        this.invokeDeleteApi = (id) => api.batch.delete(id);
    }

    @action async getAvaliables() {
        return await this.invokeApi(() => api.batch.list({ canAppointment: 1 }), (response) => {
            this.avaliables = response.data.list
        });
    }

    @action async getModel(id) {
        if (!id) {
            if (this.avaliables.length === 0) {
                await this.getAvaliables();
            }
            this.model = this.avaliables.length === 0 ? null : this.avaliables[0]
        }
        else if (this.model == null || id != this.model.id) {
            await super.getModel(id)
        }
        return this.model;
    }
}