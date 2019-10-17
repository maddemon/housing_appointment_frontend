import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'

class PermitStore extends StoreBase {
    
    @observable statistic = []
    constructor() {
        super()
        this.getListFunc = (parameter) => {
            return api.permit.list(parameter);
        };
        this.saveModelFunc = (model) => {
            return api.permit.save(model)
        };
        this.deleteFunc = (id)=>{
            return api.permit.delete(id)
        }
    }

    @action async getStatistic() {
        this.loading = true;
        const response = await api.permit.statistic();
        if (response && response.ok) {
            this.statistic = response.data;
        }
        this.loading = false;
        return this.list
    }
}

const store = new PermitStore();
export default store;