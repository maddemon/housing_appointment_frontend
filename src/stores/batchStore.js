import { observable, action } from 'mobx'
import api from '../common/api'
class BatchStore {

    @observable list = [];
    @observable page = null;
    @observable loading = false;


    @action async setList(pageIndex, pageSize) {
        this.loading = true;
        const response = await api.batch.list(pageIndex, pageSize)
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.list
        this.loading = false;
    }

    @action async save(data) {
        this.loading = true;
        let result = null;
        if (data.uuid) {
            result = await api.batch.edit(data)
        }
        else {
            result = await api.batch.add(data)
        }
        this.loading = false;
        return result;
    }
}

const store = new BatchStore();
export default store;