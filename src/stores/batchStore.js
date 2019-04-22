import { observable, action } from 'mobx'
import api from '../common/api'
class BatchStore {

    @observable list = [];
    @observable page = null

    @action async setList(pageIndex, pageSize) {
        const response = await api.batch.list(pageIndex, pageSize)
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.list
    }

    @action async save(data) {
        if (data.uuid) {
            return await api.batch.edit(data)
        }
        else {
            return await api.batch.add(data)
        }
    }
}

const store = new BatchStore();
export default store;