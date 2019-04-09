import { observable, action } from 'mobx'
import api from '../common/api'
class BatchStore {
    
    @observable list = [];

    @action async getList(page, rows) {
        this.list = await api.batch.list(page, rows)
    }

    @action async save(data) {
        if (data.uuid) {
            await api.batch.edit(data)
        }
        else {
            await api.batch.add(data)
        }
    }
}

const store = new BatchStore();
export default store;